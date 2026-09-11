import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-forest-dark">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-[#C0392B]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
