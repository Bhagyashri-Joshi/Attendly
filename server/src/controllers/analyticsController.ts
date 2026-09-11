import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

function stats(records: { status: string }[]) {
  const present = records.filter(
    (record) => record.status === "PRESENT"
  ).length;

  const absent = records.filter(
    (record) => record.status === "ABSENT"
  ).length;

  const total = present + absent;

  return {
    present,
    absent,
    total,
    percentage: total ? Math.round((present / total) * 100) : 0,
  };
}

async function subjectStats(userId: string) {
  const [subjects, records] = await Promise.all([
    prisma.subject.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),

    prisma.attendanceRecord.findMany({
      where: { userId },
      select: {
        subjectId: true,
        status: true,
      },
    }),
  ]);

  return subjects.map((subject) => {
    const subjectRecords = records.filter(
      (record) => record.subjectId === subject.id
    );

    const attendanceStats = stats(subjectRecords);

    return {
      subjectId: subject.id,
      name: subject.name,
      code: subject.code,
      color: subject.color,
      ...attendanceStats,
    };
  });
}

export async function getOverall(
  req: Request,
  res: Response
) {
  const userId = req.userId as string;

  const subjects = await subjectStats(userId);

  const records = await prisma.attendanceRecord.findMany({
    where: { userId },
    select: {
      status: true,
    },
  });

  const attendanceStats = stats(records);

  const rankedSubjects = subjects
    .filter((subject) => subject.total > 0)
    .sort((a, b) => b.percentage - a.percentage);

  res.json({
    success: true,
    data: {
      overallPercentage: attendanceStats.percentage,
      totalPresent: attendanceStats.present,
      totalAbsent: attendanceStats.absent,
      totalLectures: attendanceStats.total,
      bestSubject: rankedSubjects[0] ?? null,
      lowestSubject:
        rankedSubjects.length > 0
          ? rankedSubjects[rankedSubjects.length - 1]
          : null,
    },
  });
}

export async function getSubjects(
  req: Request,
  res: Response
) {
  const userId = req.userId as string;

  const subjects = await subjectStats(userId);

  res.json({
    success: true,
    data: subjects,
  });
}

export async function getSubject(
  req: Request,
  res: Response
) {
  const userId = req.userId as string;

  const rawSubjectId = req.params.id;

  const subjectId = Array.isArray(rawSubjectId)
    ? rawSubjectId[0]
    : rawSubjectId;

  if (!subjectId) {
    res.status(400).json({
      success: false,
      message: "Subject ID is required",
    });

    return;
  }

  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      userId,
    },
  });

  if (!subject) {
    res.status(404).json({
      success: false,
      message: "Subject not found",
    });

    return;
  }

  const records = await prisma.attendanceRecord.findMany({
    where: {
      userId,
      subjectId: subject.id,
    },

    orderBy: {
      date: "asc",
    },

    select: {
      date: true,
      status: true,
    },
  });

  const attendanceStats = stats(records);

  let present = 0;
  let absent = 0;

  const trend = records.map((record) => {
    if (record.status === "PRESENT") {
      present++;
    } else {
      absent++;
    }

    const total = present + absent;

    return {
      date: record.date.toISOString().slice(0, 10),

      percentage:
        total > 0
          ? Math.round((present / total) * 100)
          : 0,

      status: record.status,
    };
  });

  res.json({
    success: true,

    data: {
      subject: {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        color: subject.color,
      },

      ...attendanceStats,

      trend,
    },
  });
}