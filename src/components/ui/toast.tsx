"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

const ToastContext = React.createContext<{
  toast: (input: Omit<Toast, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...input, id }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const config = {
    success: { icon: CheckCircle2, accent: "text-accent", ring: "ring-accent/20" },
    error: { icon: AlertCircle, accent: "text-danger", ring: "ring-danger/20" },
    info: { icon: Info, accent: "text-brand", ring: "ring-brand-100" },
  }[toast.variant];

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm gap-3 rounded-card border border-line bg-white p-4 shadow-lift ring-1",
        config.ring,
      )}
    >
      <config.icon className={cn("mt-0.5 size-5 shrink-0", config.accent)} />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-sm leading-relaxed text-body">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="-mr-1 -mt-1 shrink-0 self-start rounded-full p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
