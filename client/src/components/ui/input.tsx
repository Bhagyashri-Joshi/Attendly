import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] text-ink placeholder:text-muted/70 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-forest/30",
          hasError ? "border-[#C0392B]/50" : "border-border focus:border-forest/40",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
