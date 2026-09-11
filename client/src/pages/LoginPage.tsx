import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/toast/useToast";
import { useAuthStore } from "@/store/authStore";
import { loginFormSchema, type LoginFormValues } from "@/schemas/authSchemas";

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      await login(values.email, values.password);
      showToast("Welcome back!", "success");
      const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to log in. Please try again.");
    }
  }

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-cream font-display text-sm">
                A
              </span>
              <span className="font-display text-lg text-forest-dark">Attendly</span>
            </Link>
            <h1 className="mt-6 font-display text-2xl text-forest-dark">Welcome back</h1>
            <p className="mt-2 text-sm text-muted">Log in to keep tracking your attendance.</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="rounded-card border border-border bg-white p-6 sm:p-8"
          >
            {formError && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-[#C0392B]/30 bg-[#C0392B]/5 px-3.5 py-2.5 text-sm text-[#C0392B]"
              >
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <FormField label="Email" htmlFor="email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@university.edu"
                  hasError={!!errors.email}
                  {...register("email")}
                />
              </FormField>

              <FormField label="Password" htmlFor="password" error={errors.password?.message}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  hasError={!!errors.password}
                  {...register("password")}
                />
              </FormField>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Logging in…" : "Log In"}
            </Button>

            <p className="mt-6 text-center text-sm text-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-forest-dark hover:underline">
                Sign up
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/" className="text-muted hover:text-forest-dark hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
