import * as React from "react";
import { cn } from "@/lib/utils";
import { initials as toInitials } from "@/lib/utils";

export function Progress({
  value,
  className,
  showLabel = false,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="h-2 w-full overflow-hidden rounded-pill bg-line-soft"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-pill bg-brand-gradient transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-sm font-semibold text-ink">{pct}%</span>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-field bg-line-soft", className)} />;
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700",
        className,
      )}
      aria-hidden
    >
      {toInitials(name)}
    </span>
  );
}

export function Alert({
  variant = "info",
  title,
  children,
  icon,
  className,
}: {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  const styles = {
    info: "bg-info-bg text-brand-700 ring-brand-100",
    success: "bg-success-bg text-success ring-success/20",
    warning: "bg-warning-bg text-warning ring-warning/20",
    danger: "bg-danger-bg text-danger ring-danger/20",
  }[variant];

  return (
    <div className={cn("rounded-field p-4 ring-1", styles, className)} role="status">
      <div className="flex gap-3">
        {icon && <span className="mt-0.5 shrink-0 [&_svg]:size-5">{icon}</span>}
        <div className="min-w-0">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {children && (
            <div className={cn("text-sm leading-relaxed", title && "mt-1")}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
