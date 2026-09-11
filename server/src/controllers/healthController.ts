import type { Request, Response } from "express";

/**
 * GET /api/health
 * Simple liveness check used by the client, uptime monitors, and
 * deployment platforms to confirm the API process is running.
 */
export function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    message: "Attendly API is running",
  });
}
