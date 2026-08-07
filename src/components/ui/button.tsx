import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-white shadow-soft hover:shadow-lift active:scale-[0.99]",
        secondary:
          "border border-line bg-white text-ink shadow-soft hover:border-brand/40 hover:shadow-card",
        outline:
          "border border-line bg-transparent text-ink hover:border-brand/40 hover:bg-brand-50",
        ghost: "text-body hover:bg-brand-50 hover:text-ink",
        danger: "bg-danger text-white shadow-soft hover:opacity-90",
        link: "text-brand underline-offset-4 hover:underline",
        inverse:
          "bg-white text-navy shadow-soft hover:shadow-lift active:scale-[0.99]",
      },
      size: {
        sm: "h-9 px-4 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-[15px] [&_svg]:size-4",
        lg: "h-12 px-6 text-[15px] [&_svg]:size-4",
        icon: "h-10 w-10 [&_svg]:size-4",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, full }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
