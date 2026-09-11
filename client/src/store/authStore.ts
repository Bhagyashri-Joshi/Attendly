import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, ApiClientError } from "@/services/apiClient";
import { registerUser, loginUser, logoutUser, fetchCurrentUser } from "@/services/authService";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  /** True only while the initial (page-load) session check is running. */
  isInitializing: boolean;
  /** True while a login/register/logout request is in flight. */
  isSubmitting: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Validates a persisted token against the API on app startup. */
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isInitializing: true,
      isSubmitting: false,
      error: null,

      login: async (email, password) => {
        set({ isSubmitting: true, error: null });
        try {
          const res = await loginUser({ email, password });
          const { user, token } = res.data!;
          setAuthToken(token);
          set({ user, token, isSubmitting: false });
        } catch (err) {
          const message =
            err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.";
          set({ isSubmitting: false, error: message });
          throw new Error(message);
        }
      },

      register: async (name, email, password) => {
        set({ isSubmitting: true, error: null });
        try {
          const res = await registerUser({ name, email, password });
          const { user, token } = res.data!;
          setAuthToken(token);
          set({ user, token, isSubmitting: false });
        } catch (err) {
          const message =
            err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.";
          set({ isSubmitting: false, error: message });
          throw new Error(message);
        }
      },

      logout: async () => {
        set({ isSubmitting: true });
        try {
          await logoutUser();
        } catch {
          // Stateless JWT — even if this call fails (e.g. offline),
          // we still clear the local session below.
        } finally {
          setAuthToken(null);
          set({ user: null, token: null, isSubmitting: false });
        }
      },

      initialize: async () => {
        const { token } = get();

        if (!token) {
          set({ isInitializing: false });
          return;
        }

        setAuthToken(token);

        try {
          const res = await fetchCurrentUser();
          set({ user: res.data!.user, isInitializing: false });
        } catch {
          // Persisted token is invalid/expired — clear the stale session.
          setAuthToken(null);
          set({ user: null, token: null, isInitializing: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "attendly-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
