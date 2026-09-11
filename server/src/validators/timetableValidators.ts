import { z } from "zod";

export const TIMETABLE_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
] as const;

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const timeSchema = z.string().regex(timeRegex, "Time must use 24-hour HH:mm format");

const optionalClearableRoom = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.string().trim().max(80, "Room is too long").nullable().optional()
);

export const createTimetableLectureSchema = z
  .object({
    subjectId: z.string().uuid("Subject ID must be a valid UUID"),
    dayOfWeek: z.enum(TIMETABLE_DAYS),
    startTime: timeSchema,
    endTime: timeSchema,
    room: optionalClearableRoom,
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  });

export const updateTimetableLectureSchema = z
  .object({
    subjectId: z.string().uuid("Subject ID must be a valid UUID").optional(),
    dayOfWeek: z.enum(TIMETABLE_DAYS).optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    room: optionalClearableRoom,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
  })
  .refine(
    (data) => !data.startTime || !data.endTime || data.startTime < data.endTime,
    {
      message: "Start time must be before end time",
      path: ["endTime"],
    }
  );

export type CreateTimetableLectureInput = z.infer<typeof createTimetableLectureSchema>;
export type UpdateTimetableLectureInput = z.infer<typeof updateTimetableLectureSchema>;
