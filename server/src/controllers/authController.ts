import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { toSafeUser } from "../types/auth";
import { ApiError } from "../utils/ApiError";
import type { RegisterInput, LoginInput } from "../validators/authValidators";

/**
 * POST /api/auth/register
 * Creates a new user with a bcrypt-hashed password and returns the
 * user (without passwordHash) plus a JWT so the client can log the
 * user straight in after signup.
 */
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body as RegisterInput;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = signToken({ userId: user.id });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { user: toSafeUser(user), token },
  });
}

/**
 * POST /api/auth/login
 * Verifies credentials and returns the user plus a fresh JWT.
 * Uses one generic "invalid credentials" message for both a missing
 * account and a wrong password, so requests can't be used to probe
 * which emails are registered.
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { user: toSafeUser(user), token },
  });
}

/**
 * GET /api/auth/me
 * Protected by the `authenticate` middleware, which populates
 * req.userId from the JWT. Returns the current user record.
 */
export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  res.status(200).json({
    success: true,
    message: "Authenticated user retrieved",
    data: { user: toSafeUser(user) },
  });
}

/**
 * POST /api/auth/logout
 * This app's JWTs are stateless (no server-side session store), so
 * there is nothing to invalidate server-side — the client is
 * responsible for discarding the token. This endpoint exists so the
 * client has a consistent, explicit logout call, and so a token
 * denylist can be added here later without changing the client.
 */
export async function logout(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
