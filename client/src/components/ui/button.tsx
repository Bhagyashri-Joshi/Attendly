import * as React from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-forest text-cream hover:bg-forest-dark",
  secondary: "bg-peach text-forest-dark hover:bg-peach-hover",
  outline: "border border-forest/25 text-forest-dark bg-transparent hover:bg-light-green",
  ghost: "bg-transparent text-forest-dark hover:bg-light-green",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-5 text-[15px]",
  sm: "h-9 px-4 text-sm",
  lg: "h-13 px-7 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
