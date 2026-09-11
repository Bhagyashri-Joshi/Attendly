/**
 * Shared API response shapes. Keep these in sync with the server's
 * response contracts so future phases (auth, subjects, attendance)
 * can extend them without breaking existing consumers.
 */

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface HealthCheckResponse {
  success: boolean;
  message: string;
}
