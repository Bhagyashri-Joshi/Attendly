import { apiClient } from "./apiClient";
import type { ApiSuccess } from "@/types/api";
import type { Subject } from "@/types/subject";

export interface SubjectInput {
  name: string;
  code?: string;
  faculty?: string;
  color?: string;
}

export function fetchSubjects() {
  return apiClient.get<ApiSuccess<{ subjects: Subject[] }>>("/api/subjects");
}

export function createSubject(input: SubjectInput) {
  return apiClient.post<ApiSuccess<{ subject: Subject }>>("/api/subjects", input);
}

export function updateSubject(id: string, input: SubjectInput) {
  return apiClient.put<ApiSuccess<{ subject: Subject }>>(`/api/subjects/${id}`, input);
}

export function deleteSubject(id: string) {
  return apiClient.delete<ApiSuccess<undefined>>(`/api/subjects/${id}`);
}
