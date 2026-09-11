import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import type {
  CreateTimetableLectureInput,
  UpdateTimetableLectureInput,
} from "../validators/timetableValidators";
import { TIMETABLE_DAYS } from "../validators/timetableValidators";

const DAY_ORDER = new Map(TIMETABLE_DAYS.map((day, index) => [day, index]));

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function hasTimeOverlap(startA: string, endA: string, startB: string, endB: string) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}

async function assertOwnedSubject(subjectId: string, userId: string) {
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  if (subject.userId !== userId) {
    throw new ApiError(403, "You do not have access to this subject");
  }

  return subject;
}

async function findOwnedLecture(id: string, userId: string) {
  const lecture = await prisma.timetableLecture.findUnique({
    where: { id },
    include: { subject: true },
  });

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  if (lecture.userId !== userId) {
    throw new ApiError(403, "You do not have access to this lecture");
  }

  return lecture;
}

/** GET /api/timetable */
export async function listTimetableLectures(req: Request, res: Response) {
  const lectures = await prisma.timetableLecture.findMany({
    where: { userId: req.userId },
    include: { subject: true },
  });

  lectures.sort((a, b) => {
    const dayDifference =
      (DAY_ORDER.get(a.dayOfWeek as (typeof TIMETABLE_DAYS)[number]) ?? 99) -
      (DAY_ORDER.get(b.dayOfWeek as (typeof TIMETABLE_DAYS)[number]) ?? 99);
    return dayDifference || a.startTime.localeCompare(b.startTime);
  });

  res.status(200).json({
    success: true,
    message: "Timetable retrieved successfully",
    data: { lectures },
  });
}

/** POST /api/timetable */
export async function createTimetableLecture(req: Request, res: Response) {
  const userId = req.userId as string;
  const { subjectId, dayOfWeek, startTime, endTime, room } =
    req.body as CreateTimetableLectureInput;

  await assertOwnedSubject(subjectId, userId);

  const existingLectures = await prisma.timetableLecture.findMany({
    where: { userId, dayOfWeek },
  });

  const overlaps = existingLectures.some((lecture) =>
    hasTimeOverlap(startTime, endTime, lecture.startTime, lecture.endTime)
  );

  if (overlaps) {
    throw new ApiError(409, "A lecture already exists during this time.");
  }

  const lecture = await prisma.timetableLecture.create({
    data: {
      userId,
      subjectId,
      dayOfWeek,
      startTime,
      endTime,
      room: room ?? null,
    },
    include: { subject: true },
  });

  res.status(201).json({
    success: true,
    message: "Lecture added successfully",
    data: { lecture },
  });
}

/** PUT /api/timetable/:id */
export async function updateTimetableLecture(req: Request, res: Response) {
  const id = req.params.id as string;
  const userId = req.userId as string;
  const existing = await findOwnedLecture(id, userId);
  const input = req.body as UpdateTimetableLectureInput;

  if (input.subjectId !== undefined) {
    await assertOwnedSubject(input.subjectId, userId);
  }

  const resultingStartTime = input.startTime ?? existing.startTime;
  const resultingEndTime = input.endTime ?? existing.endTime;
  const resultingDay = input.dayOfWeek ?? existing.dayOfWeek;

  if (resultingStartTime >= resultingEndTime) {
    throw new ApiError(400, "Start time must be before end time");
  }

  const conflictingLectures = await prisma.timetableLecture.findMany({
    where: {
      userId,
      dayOfWeek: resultingDay,
      id: { not: id },
    },
  });

  const hasConflict = conflictingLectures.some((lecture) =>
    hasTimeOverlap(
      resultingStartTime,
      resultingEndTime,
      lecture.startTime,
      lecture.endTime
    )
  );

  if (hasConflict) {
    throw new ApiError(409, "A lecture already exists during this time.");
  }

  const lecture = await prisma.timetableLecture.update({
    where: { id },
    data: input,
    include: { subject: true },
  });

  res.status(200).json({
    success: true,
    message: "Lecture updated successfully",
    data: { lecture },
  });
}

/** DELETE /api/timetable/:id */
export async function deleteTimetableLecture(req: Request, res: Response) {
  const id = req.params.id as string;
  await findOwnedLecture(id, req.userId as string);

  await prisma.timetableLecture.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Lecture deleted successfully",
  });
}
