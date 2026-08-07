"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/misc";

export interface Column<T> {
  key: string;
  header: string;
  /** Omit to render nothing sortable — most action columns. */
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

/**
 * Dense table for review queues and directories. Client-side sorting only —
 * every admin list is bounded server-side (200–500 rows), so paging would add
 * complexity without buying anything at MVP scale.
 */
export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
  isLoading = false,
  emptyState,
  className,
}: {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}) {
  const [sort, setSort] = React.useState<{ key: string; desc: boolean } | null>(null);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return rows;

    return [...rows].sort((a, b) => {
      const left = column.sortValue!(a);
      const right = column.sortValue!(b);
      if (left === right) return 0;
      const result = left > right ? 1 : -1;
      return sort.desc ? -result : result;
    });
  }, [rows, sort, columns]);

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-2 p-4", className)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {columns.map((column) => {
              const sortable = Boolean(column.sortValue);
              const active = sort?.key === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-[13px] font-semibold text-muted",
                    column.headerClassName,
                  )}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort((prev) =>
                          prev?.key === column.key
                            ? { key: column.key, desc: !prev.desc }
                            : { key: column.key, desc: false },
                        )
                      }
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors hover:text-ink",
                        active && "text-ink",
                      )}
                    >
                      {column.header}
                      {active ? (
                        sort!.desc ? (
                          <ChevronDown className="size-3.5" />
                        ) : (
                          <ChevronUp className="size-3.5" />
                        )
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-line">
          {sorted.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "transition-colors",
                onRowClick && "cursor-pointer hover:bg-canvas/70",
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn("px-4 py-3.5 align-middle text-[15px]", column.className)}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
