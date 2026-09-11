import { z } from "zod";
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").refine((v)=>!Number.isNaN(Date.parse(`${v}T00:00:00Z`)), "Invalid date");
const statusSchema = z.enum(["PRESENT", "ABSENT"]);
const noteSchema = z.string().trim().max(1000, "Notes must be 1000 characters or fewer").optional();
const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]).default("LOW");
export const createAttendanceSchema = z.object({
  subjectId:z.string().min(1),
  timetableLectureId:z.string().min(1).optional(),
  date:dateSchema,
  status:statusSchema,
  note:noteSchema,
  priority:prioritySchema.optional(),
});
export const updateAttendanceSchema = z.object({ subjectId:z.string().min(1).optional(), timetableLectureId:z.string().min(1).nullable().optional(), date:dateSchema.optional(), status:statusSchema.optional() }).refine(d=>Object.values(d).some(v=>v!==undefined),"Provide at least one field to update");
export type CreateAttendanceInput=z.infer<typeof createAttendanceSchema>; export type UpdateAttendanceInput=z.infer<typeof updateAttendanceSchema>;
