import { apiClient } from "./apiClient"; import type { ApiSuccess } from "@/types/api"; import type { DashboardData } from "@/types/dashboard";
export const fetchDashboard=()=>apiClient.get<ApiSuccess<DashboardData>>("/api/dashboard");
