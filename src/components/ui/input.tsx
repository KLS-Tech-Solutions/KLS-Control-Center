import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "h-11 w-full rounded-field border border-line bg-white px-4 text-base sm:text-[15px] text-ink outline-none transition-colors",
      "placeholder:text-muted focus:border-brand disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted",
      invalid && "border-danger focus:border-danger",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, rows = 5, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    aria-invalid={invalid || undefined}
    className={cn(
      "w-full rounded-field border border-line bg-white px-4 py-3 text-base sm:text-[15px] leading-relaxed text-ink outline-none transition-colors",
      "placeholder:text-muted focus:border-brand disabled:cursor-not-allowed disabled:bg-canvas",
      invalid && "border-danger focus:border-danger",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <select
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "h-11 w-full appearance-none rounded-field border border-line bg-white px-4 text-base sm:text-[15px] text-ink outline-none transition-colors",
      "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237b8b99%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_0.9rem_center] bg-no-repeat pr-10",
      "focus:border-brand disabled:cursor-not-allowed disabled:bg-canvas",
      invalid && "border-danger focus:border-danger",
      className,
    )}
    {...props}
  />
));
Select.displayName = "Select";
