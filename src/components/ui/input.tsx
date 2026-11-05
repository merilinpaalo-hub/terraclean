import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-14 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-soft placeholder:text-slate-500 focus-visible:border-primary",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
