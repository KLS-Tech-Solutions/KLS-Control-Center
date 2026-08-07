"use client";

import * as React from "react";
import { ScrollText } from "lucide-react";

import { formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/table";
import { FilterBar } from "@/components/ui/filter-bar";
import { RequireCapability } from "@/components/shared/role-gate";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import { useActivityLogs } from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import type { ActivityLogEntry } from "@/types";

const MODULE_OPTIONS = [
  { value: "", label: "All modules" },
  { value: "auth", label: "Auth" },
  { value: "enrollment", label: "Enrolment" },
  { value: "submission", label: "Submissions" },
  { value: "review", label: "Reviews" },
  { value: "payment", label: "Payments" },
  { value: "certificate", label: "Certificates" },
];

export default function ActivityLogsPage() {
  return (
    <RequireCapability capability="readActivityLogs">
      <ActivityLogs />
    </RequireCapability>
  );
}

function ActivityLogs() {
  const [module, setModule] = React.useState("");
  const query = useActivityLogs(module ? { module } : {});

  const columns: Column<ActivityLogEntry>[] = [
    {
      key: "activity",
      header: "Activity",
      sortValue: (row) => row.activity,
      render: (row) => <span className="text-[15px] text-ink">{row.activity}</span>,
    },
    {
      key: "module",
      header: "Module",
      sortValue: (row) => row.module,
      render: (row) => <Badge variant="neutral">{row.module}</Badge>,
    },
    {
      key: "when",
      header: "When",
      sortValue: (row) => row.created_at,
      render: (row) => (
        <span className="whitespace-nowrap text-[13px] text-body">
          {formatDateTime(row.created_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Activity logs"
        description="An audit trail of every consequential action, by students and administrators."
      />

      <Card className="overflow-hidden p-0">
        <FilterBar
          filters={[
            { label: "Module", value: module, options: MODULE_OPTIONS, onChange: setModule },
          ]}
          resultCount={query.data?.length}
        />

        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error) ? query.error.userMessage : "Couldn't load logs."
            }
            onRetry={() => query.refetch()}
          />
        ) : (
          <DataTable
            rows={query.data ?? []}
            columns={columns}
            getRowKey={(row) => row.id}
            isLoading={query.isPending}
            emptyState={
              <EmptyState
                icon={<ScrollText />}
                title="No activity"
                description="Nothing has been logged for this filter."
              />
            }
          />
        )}
      </Card>
    </div>
  );
}
