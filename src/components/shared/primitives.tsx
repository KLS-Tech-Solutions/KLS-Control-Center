import * as React from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-body">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "brand" | "warning" | "success" | "danger";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand",
    warning: "bg-warning-bg text-warning",
    success: "bg-success-bg text-success",
    danger: "bg-danger-bg text-danger",
  }[tone];

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-muted">{label}</p>
        {icon && (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-xl [&_svg]:size-4",
              tones,
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-canvas text-muted [&_svg]:size-5">
          {icon}
        </span>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <h3 className="text-lg font-semibold">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 text-sm font-semibold text-brand hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/** Stage chip for the student directory — same vocabulary as the student app. */
export function StageBadge({ stage }: { stage: string }) {
  const label = stage.replaceAll("_", " ");
  const tone =
    stage === "certificate_issued"
      ? "bg-success-bg text-success ring-success/20"
      : stage === "not_enrolled"
        ? "bg-canvas text-muted ring-line"
        : stage.includes("approved") || stage === "paid"
          ? "bg-brand-50 text-brand-700 ring-brand-100"
          : "bg-warning-bg text-warning ring-warning/20";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-medium capitalize ring-1",
        tone,
      )}
    >
      {label}
    </span>
  );
}
