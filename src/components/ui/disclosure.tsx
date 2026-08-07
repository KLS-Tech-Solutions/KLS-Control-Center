"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-card border border-line bg-white", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-[15px] font-semibold text-ink">{item.question}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-muted transition-transform duration-300",
                  isOpen && "rotate-180 text-brand",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-[15px] leading-relaxed text-body">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Tabs({
  tabs,
  value,
  onValueChange,
  className,
}: {
  tabs: { value: string; label: string; count?: number }[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("no-scrollbar flex gap-1 overflow-x-auto rounded-pill bg-canvas p-1", className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-pill px-4 py-2 text-sm font-medium transition-colors",
              active ? "bg-white text-ink shadow-soft" : "text-body hover:text-ink",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "rounded-pill px-1.5 text-xs",
                  active ? "bg-brand-50 text-brand-700" : "bg-line-soft text-muted",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
