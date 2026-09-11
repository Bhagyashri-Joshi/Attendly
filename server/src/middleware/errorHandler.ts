import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { isProduction } from "../config/env";

/**
 * Extracts a usable HTTP status code from an unknown error. Handles our
 * own ApiError, plus third-party errors that attach a numeric
 * `status`/`statusCode` (e.g. body-parser's malformed-JSON SyntaxError,
 * which sets `status: 400`). Falls back to 500 for anything else.
 */
function resolveStatusCode(err: unknown): number {
  if (err instanceof ApiError) return err.statusCode;

  if (err && typeof err === "object") {
    const candidate =
      "statusCode" in err ? (err as { statusCode?: unknown }).statusCode :
      "status" in err ? (err as { status?: unknown }).status :
      undefined;

    if (typeof candidate === "number" && candidate >= 400 && candidate < 600) {
      return candidate;
    }
  }

  return 500;
}

/**
 * Centralized error handler. Any error thrown (or passed to next())
 * anywhere in the request lifecycle ends up here, so response shape
 * stays consistent as new routes/features are added in later phases.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const statusCode = resolveStatusCode(err);
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";

  if (!isProduction) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProduction ? "Internal server error" : message,
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
