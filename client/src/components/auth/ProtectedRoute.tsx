import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

/**
 * Gates a route behind authentication. While the initial session
 * check is running (page load / refresh), shows a loading screen
 * instead of flashing a redirect. Once resolved, redirects to /login
 * (preserving the intended destination) if there's no user.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isInitializing } = useAuthStore();
  const location = useLocation();

  if (isInitializing) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
