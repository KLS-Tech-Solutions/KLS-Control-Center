"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/*
        Header and footer stay put; only the body scrolls. A long form — the
        task editor especially — must never push its Save button off-screen,
        and on a short laptop window the whole dialog has to stay reachable.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden",
          "rounded-card border border-line bg-white shadow-lift",
          "duration-200 animate-in fade-in zoom-in-95 sm:max-h-[calc(100dvh-4rem)]",
          width,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-1.5 text-muted backdrop-blur transition-colors hover:bg-canvas hover:text-ink"
        >
          <X className="size-4" />
        </button>

        {(title || description) && (
          <div className="shrink-0 p-5 pb-0 pr-12 sm:p-6 sm:pb-0">
            {title && <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>}
            {description && (
              <p className="mt-2 text-[15px] leading-relaxed text-body">{description}</p>
            )}
          </div>
        )}

        {children && (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
            {children}
          </div>
        )}

        {footer && (
          <div className="shrink-0 flex flex-col-reverse gap-3 border-t border-line bg-white p-5 sm:flex-row sm:justify-end sm:p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
