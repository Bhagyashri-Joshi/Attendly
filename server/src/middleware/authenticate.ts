import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

/**
 * Protects a route behind a valid JWT. Expects `Authorization: Bearer
 * <token>`. On success, attaches `req.userId` for downstream handlers.
 * This app's JWTs are stateless — there is no server-side session or
 * token revocation list, so any structurally valid, unexpired token
 * signed with our secret is trusted.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, "Session expired, please log in again"));
    }
    return next(new ApiError(401, "Invalid authentication token"));
  }
}
