import { Router } from "express";
import { register, login, me, logout } from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", validateBody(registerSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));
router.get("/me", authenticate, asyncHandler(me));
router.post("/logout", asyncHandler(logout));

export default router;
