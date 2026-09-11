import express, { type Application } from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { env } from "./config/env";

/**
 * Builds and configures the Express application.
 * Kept separate from server.ts so the app instance
 * can be imported directly in tests without binding a port.
 */
export function createApp(): Application {
  const app = express();

  const allowedOrigins = [
    env.clientUrl,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests without an Origin header
        // such as Postman, curl, or server-to-server requests
        if (!origin) {
          callback(null, true);
          return;
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the Attendly API",
    });
  });

  app.use("/api", routes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}