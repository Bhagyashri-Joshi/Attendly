import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

/**
 * Validates and coerces `req.body` against a Zod schema before it
 * reaches a controller. On failure, throws a 400 ApiError with a
 * flat, human-readable message per field — friendly enough to show
 * directly under a form field on the client.
 */
export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const message = firstIssue
        ? `${firstIssue.path.join(".") || "field"}: ${firstIssue.message}`
        : "Invalid request body";
      return next(new ApiError(400, message));
    }

    req.body = result.data;
    next();
  };
}
