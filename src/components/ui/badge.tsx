import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        neutral: "bg-canvas text-body ring-1 ring-line",
        brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
        success: "bg-success-bg text-success ring-1 ring-success/20",
        warning: "bg-warning-bg text-warning ring-1 ring-warning/20",
        danger: "bg-danger-bg text-danger ring-1 ring-danger/20",
        accent: "bg-accent-50 text-accent ring-1 ring-accent/20",
        solid: "bg-brand-gradient text-white",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
