import type { Request, Response } from "express";

/**
 * Catches any request to an /api/* route that didn't match a defined
 * route. Kept separate from the generic error handler so API 404s
 * always return consistent JSON, regardless of how routes evolve.
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
