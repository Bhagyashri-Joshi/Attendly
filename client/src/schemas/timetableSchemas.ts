import { z } from "zod";
import { TIMETABLE_DAYS } from "@/types/timetable";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const timetableFormSchema = z
  .object({
    subjectId: z.string().min(1, "Subject is required"),
    dayOfWeek: z.enum(TIMETABLE_DAYS),
    startTime: z.string().regex(timeRegex, "Enter a valid start time"),
    endTime: z.string().regex(timeRegex, "Enter a valid end time"),
    room: z.string().trim().max(80, "Room is too long"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type TimetableFormValues = z.infer<typeof timetableFormSchema>;
