import { useCallback, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ToastContext, type ToastVariant } from "./toastContext";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "border-forest/20 bg-white text-forest-dark",
  error: "border-[#C0392B]/30 bg-white text-forest-dark",
  info: "border-border bg-white text-forest-dark",
};

const variantIcon: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const variantIconColor: Record<ToastVariant, string> = {
  success: "text-forest",
  error: "text-[#C0392B]",
  info: "text-muted",
};

/**
 * Lightweight, dependency-free toast system styled with Attendly's
 * existing design tokens. Wrap the app once; call useToast() anywhere
 * to surface a success/error/info message.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        {toasts.map((toast) => {
          const Icon = variantIcon[toast.variant];
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border px-4 py-3 shadow-[0_12px_30px_-15px_rgba(24,58,11,0.35)]",
                variantStyles[toast.variant]
              )}
            >
              <Icon size={18} className={cn("mt-0.5 shrink-0", variantIconColor[toast.variant])} />
              <p className="flex-1 text-sm leading-snug">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-muted hover:text-forest-dark"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
