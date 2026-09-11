import { z } from "zod";
export const attendanceFormSchema=z.object({
  subjectId:z.string().min(1,"Subject is required"),
  date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"Choose a valid date"),
  status:z.enum(["PRESENT","ABSENT"]),
  note:z.string().trim().max(1000,"Notes must be 1000 characters or fewer").optional(),
  priority:z.enum(["LOW","MEDIUM","HIGH"]),
});
export type AttendanceFormValues=z.infer<typeof attendanceFormSchema>;
