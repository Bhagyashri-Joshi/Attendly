import { Router } from "express";
import {
  createTimetableLecture,
  deleteTimetableLecture,
  listTimetableLectures,
  updateTimetableLecture,
} from "../controllers/timetableController";
import { authenticate } from "../middleware/authenticate";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createTimetableLectureSchema,
  updateTimetableLectureSchema,
} from "../validators/timetableValidators";

const router = Router();

router.use(authenticate);
router.get("/", asyncHandler(listTimetableLectures));
router.post("/", validateBody(createTimetableLectureSchema), asyncHandler(createTimetableLecture));
router.put(
  "/:id",
  validateBody(updateTimetableLectureSchema),
  asyncHandler(updateTimetableLecture)
);
router.delete("/:id", asyncHandler(deleteTimetableLecture));

export default router;
