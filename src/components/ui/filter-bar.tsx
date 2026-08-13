"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input, Select } from "@/components/ui/input";

export interface FilterOption {
  value: string;
  label: string;
}

/** Search + status filter used by every list screen, so they behave alike. */
export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters = [],
  resultCount,
  className,
  children,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  resultCount?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      {onSearchChange && (
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 pl-10 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      )}

      {filters.map((filter) => (
        <label key={filter.label} className="flex w-full items-center gap-2 sm:w-auto">
          <span className="sr-only">{filter.label}</span>
          <Select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="h-10 w-full sm:w-auto sm:min-w-[10rem]"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      ))}

      {children}

      {typeof resultCount === "number" && (
        <span className="text-[13px] text-muted sm:ml-auto">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      )}
    </div>
  );
}
