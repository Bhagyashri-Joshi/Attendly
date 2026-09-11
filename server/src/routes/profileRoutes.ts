import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";
import { getProfile, updateProfile } from "../controllers/profileController";
const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(getProfile));
router.put("/", asyncHandler(updateProfile));
export default router;
