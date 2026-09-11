import { Router } from "express";
import {
  listSubjects,
  createSubject,
  getSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController";
import { validateBody } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { createSubjectSchema, updateSubjectSchema } from "../validators/subjectValidators";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every subject route requires a valid session — a user may only
// ever see or modify their own subjects.
router.use(authenticate);

router.get("/", asyncHandler(listSubjects));
router.post("/", validateBody(createSubjectSchema), asyncHandler(createSubject));
router.get("/:id", asyncHandler(getSubject));
router.put("/:id", validateBody(updateSubjectSchema), asyncHandler(updateSubject));
router.delete("/:id", asyncHandler(deleteSubject));

export default router;
