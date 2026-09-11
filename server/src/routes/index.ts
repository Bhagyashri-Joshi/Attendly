import { Router } from "express";
import healthRoutes from "./healthRoutes";
import authRoutes from "./authRoutes";
import subjectRoutes from "./subjectRoutes";
import timetableRoutes from "./timetableRoutes";
import attendanceRoutes from "./attendanceRoutes";
import dashboardRoutes from "./dashboardRoutes";
import analyticsRoutes from "./analyticsRoutes";
import profileRoutes from "./profileRoutes";
import todoRoutes from "./todoRoutes";

const router = Router();

/**
 * All API routes are mounted here under their own path segment.
 * Phase 3+ additions (subjects, timetable, attendance) should
 * register their routers in this file rather than in the app entry.
 */
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/subjects", subjectRoutes);
router.use("/timetable", timetableRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/profile", profileRoutes);
router.use("/todos", todoRoutes);

export default router;
