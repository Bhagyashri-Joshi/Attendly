import { apiClient } from "./apiClient";
import type { ApiSuccess } from "@/types/api";

export interface SubjectAnalytics {
  subjectId: string;
  name: string;
  code: string;
  color: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export interface OverallAnalytics {
  overallPercentage: number;
  totalPresent: number;
  totalAbsent: number;
  totalLectures: number;
  bestSubject: SubjectAnalytics | null;
  lowestSubject: SubjectAnalytics | null;
}

export interface SubjectTrend {
  date: string;
  percentage: number;
  status: string;
}

export interface SubjectDetail {
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
  };
  present: number;
  absent: number;
  total: number;
  percentage: number;
  trend: SubjectTrend[];
}

export const getOverallAnalytics = () =>
  apiClient.get<ApiSuccess<OverallAnalytics>>(
    "/api/analytics/overall"
  );

export const getSubjectAnalytics = () =>
  apiClient.get<ApiSuccess<SubjectAnalytics[]>>(
    "/api/analytics/subjects"
  );

export const getSubjectDetail = (id: string) =>
  apiClient.get<ApiSuccess<SubjectDetail>>(
    `/api/analytics/subject/${id}`
  );