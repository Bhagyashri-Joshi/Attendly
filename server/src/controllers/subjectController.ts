import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import type { CreateSubjectInput, UpdateSubjectInput } from "../validators/subjectValidators";

function normalizeComparable(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? null;
}

function normalizeSubjectName(value: string) {
  return value.trim();
}

/**
 * Loads a subject by id and asserts the authenticated user owns it.
 * Distinguishes "doesn't exist" (404) from "exists but isn't yours"
 * (403) so callers get an accurate status code either way.
 */
async function findOwnedSubject(id: string, userId: string) {
  const subject = await prisma.subject.findUnique({ where: { id } });

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  if (subject.userId !== userId) {
    throw new ApiError(403, "You do not have access to this subject");
  }

  return subject;
}

/**
 * GET /api/subjects
 * Returns only the authenticated user's subjects.
 */
export async function listSubjects(req: Request, res: Response) {
  const subjects = await prisma.subject.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json({
    success: true,
    message: "Subjects retrieved successfully",
    data: { subjects },
  });
}

/**
 * POST /api/subjects
 * Creates a subject owned by the authenticated user.
 */
export async function createSubject(req: Request, res: Response) {
  const { name, code, faculty, color } = req.body as CreateSubjectInput;
  const userId = req.userId as string;
  const normalizedName = normalizeSubjectName(name);
  const normalizedCode = normalizeComparable(code ?? null);

  const duplicateName = await prisma.subject.findFirst({
    where: {
      userId,
      name: { equals: normalizedName, mode: "insensitive" },
    },
  });

  if (duplicateName) {
    throw new ApiError(409, "A subject with this name already exists");
  }

  if (normalizedCode) {
    const duplicateCode = await prisma.subject.findFirst({
      where: {
        userId,
        code: { not: null, equals: normalizedCode, mode: "insensitive" },
      },
    });

    if (duplicateCode) {
      throw new ApiError(409, "A subject with this code already exists");
    }
  }

  const subject = await prisma.subject.create({
    data: {
      userId,
      name: normalizedName,
      code: normalizedCode ? code!.trim() : null,
      faculty: faculty ?? null,
      color: color ?? null,
    },
  });

  res.status(201).json({
    success: true,
    message: "Subject added successfully",
    data: { subject },
  });
}

/**
 * GET /api/subjects/:id
 */
export async function getSubject(req: Request, res: Response) {
  const subject = await findOwnedSubject(req.params.id as string, req.userId as string);

  res.status(200).json({
    success: true,
    message: "Subject retrieved successfully",
    data: { subject },
  });
}

/**
 * PUT /api/subjects/:id
 * Ownership is checked before the write. `undefined` fields are left
 * untouched by Prisma; `null` fields (from a blanked-out optional
 * input) are explicitly cleared. See subjectValidators.ts.
 */
export async function updateSubject(req: Request, res: Response) {
  const subjectId = req.params.id as string;
  const existing = await findOwnedSubject(subjectId, req.userId as string);
  const { name, code, faculty, color } = req.body as UpdateSubjectInput;
  const userId = req.userId as string;

  const nextName = name !== undefined ? normalizeSubjectName(name) : existing.name;
  const nextCode = code !== undefined ? (code === null ? null : code.trim()) : existing.code?.trim() ?? null;
  const normalizedCode = normalizeComparable(nextCode ?? null);

  const duplicateName = await prisma.subject.findFirst({
    where: {
      userId,
      id: { not: subjectId },
      name: { equals: nextName, mode: "insensitive" },
    },
  });

  if (duplicateName) {
    throw new ApiError(409, "A subject with this name already exists");
  }

  if (normalizedCode) {
    const duplicateCode = await prisma.subject.findFirst({
      where: {
        userId,
        id: { not: subjectId },
        code: { not: null, equals: normalizedCode, mode: "insensitive" },
      },
    });

    if (duplicateCode) {
      throw new ApiError(409, "A subject with this code already exists");
    }
  }

  const subject = await prisma.subject.update({
    where: { id: subjectId },
    data: {
      name: nextName,
      code: nextCode,
      faculty,
      color,
    },
  });

  res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    data: { subject },
  });
}

/**
 * DELETE /api/subjects/:id
 */
export async function deleteSubject(req: Request, res: Response) {
  await findOwnedSubject(req.params.id as string, req.userId as string);

  await prisma.subject.delete({ where: { id: req.params.id as string } });

  res.status(200).json({
    success: true,
    message: "Subject deleted successfully",
  });
}
