import { apiClient } from "./apiClient";
import type { ApiSuccess } from "@/types/api";
import type { AuthPayload, LoginInput, RegisterInput, User } from "@/types/auth";

export function registerUser(input: RegisterInput) {
  return apiClient.post<ApiSuccess<AuthPayload>>("/api/auth/register", input);
}

export function loginUser(input: LoginInput) {
  return apiClient.post<ApiSuccess<AuthPayload>>("/api/auth/login", input);
}

export function fetchCurrentUser() {
  return apiClient.get<ApiSuccess<{ user: User }>>("/api/auth/me");
}

export function logoutUser() {
  return apiClient.post<ApiSuccess<undefined>>("/api/auth/logout");
}
