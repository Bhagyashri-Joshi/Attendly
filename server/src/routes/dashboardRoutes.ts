import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";
import { getDashboard } from "../controllers/dashboardController";
const router=Router(); router.use(authenticate); router.get("/",asyncHandler(getDashboard)); export default router;
