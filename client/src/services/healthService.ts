import { apiClient } from "./apiClient";
import type { HealthCheckResponse } from "@/types/api";

export function getApiHealth() {
  return apiClient.get<HealthCheckResponse>("/api/health");
}
