import { apiClient } from "./apiClient";
import type { ApiSuccess } from "@/types/api";
import type { TimetableDay, TimetableLecture } from "@/types/timetable";

export interface TimetableLectureInput {
  subjectId: string;
  dayOfWeek: TimetableDay;
  startTime: string;
  endTime: string;
  room?: string;
}

export function fetchTimetable() {
  return apiClient.get<ApiSuccess<{ lectures: TimetableLecture[] }>>("/api/timetable");
}

export function createTimetableLecture(input: TimetableLectureInput) {
  return apiClient.post<ApiSuccess<{ lecture: TimetableLecture }>>("/api/timetable", input);
}

export function updateTimetableLecture(id: string, input: TimetableLectureInput) {
  return apiClient.put<ApiSuccess<{ lecture: TimetableLecture }>>(`/api/timetable/${id}`, input);
}

export function deleteTimetableLecture(id: string) {
  return apiClient.delete<ApiSuccess<undefined>>(`/api/timetable/${id}`);
}
