import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { toSafeUser } from "../types/auth";

export async function getProfile(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, data: { user: toSafeUser(user) } });
}

export async function updateProfile(req: Request, res: Response) {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : undefined;
  const profileImage = req.body.profileImage === null ? null : typeof req.body.profileImage === "string" ? req.body.profileImage.trim() : undefined;
  if (name !== undefined && !name) throw new ApiError(400, "Name cannot be empty");
  if (profileImage !== undefined && profileImage !== null && profileImage && !/^https?:\/\//i.test(profileImage)) throw new ApiError(400, "Profile image must be a valid URL");
  if (name === undefined && profileImage === undefined) throw new ApiError(400, "Provide a name or profile image");
  const user = await prisma.user.update({ where: { id: req.userId }, data: { ...(name !== undefined ? { name } : {}), ...(profileImage !== undefined ? { profileImage: profileImage || null } : {}) } });
  res.json({ success: true, message: "Profile updated successfully", data: { user: toSafeUser(user) } });
}
