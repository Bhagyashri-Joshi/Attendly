import type { Subject } from "@/types/subject";

export const TIMETABLE_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
] as const;

export type TimetableDay = (typeof TIMETABLE_DAYS)[number];

export interface TimetableLecture {
  id: string;
  userId: string;
  subjectId: string;
  dayOfWeek: TimetableDay;
  startTime: string;
  endTime: string;
  room: string | null;
  createdAt: string;
  updatedAt: string;
  subject: Subject;
}
