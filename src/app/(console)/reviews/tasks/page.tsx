"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Clock } from "lucide-react";

import { formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/table";
import { FilterBar } from "@/components/ui/filter-bar";
import { SubmissionStatusBadge } from "@/components/shared/status";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import { useTaskQueue } from "@/hooks/use-reviews";
import { isApiError } from "@/lib/api/errors";
import type { SubmissionStatus, TaskSubmission } from "@/types";

const STATUS_OPTIONS = [
  { value: "under_review", label: "Awaiting review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Needs changes" },
  { value: "", label: "All statuses" },
];

export default function TaskReviewQueuePage() {
  const router = useRouter();
  const [status, setStatus] = React.useState<string>("under_review");
  const [search, setSearch] = React.useState("");

  const query = useTaskQueue(
    status ? { status: status as SubmissionStatus } : {},
  );

  const rows = React.useMemo(() => {
    const all = query.data ?? [];
    if (!search.trim()) return all;
    const needle = search.toLowerCase();
    return all.filter(
      (row) =>
        row.title.toLowerCase().includes(needle) ||
        row.github_url.toLowerCase().includes(needle),
    );
  }, [query.data, search]);

  const columns: Column<TaskSubmission>[] = [
    {
      key: "title",
      header: "Submission",
      sortValue: (row) => row.title,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{row.title}</p>
          <p className="truncate text-[13px] text-muted">{row.github_url}</p>
        </div>
      ),
    },
    {
      key: "attempt",
      header: "Attempt",
      sortValue: (row) => row.attempt,
      render: (row) =>
        row.attempt > 1 ? (
          <Badge variant="warning">Attempt {row.attempt}</Badge>
        ) : (
          <span className="text-[13px] text-muted">First</span>
        ),
    },
    {
      key: "screenshots",
      header: "Files",
      sortValue: (row) => row.screenshots.length,
      render: (row) => (
        <span className="text-[13px] text-body">{row.screenshots.length} screenshots</span>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      sortValue: (row) => row.submitted_at ?? "",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] text-body">
          <Clock className="size-3.5 text-muted" />
          {formatDateTime(row.submitted_at)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      render: (row) => <SubmissionStatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Task reviews"
        description="Every approval here moves a student forward. A rejection sends your remarks straight to them."
      />

      <Card className="overflow-hidden p-0">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search title or repository…"
          filters={[
            {
              label: "Status",
              value: status,
              options: STATUS_OPTIONS,
              onChange: setStatus,
            },
          ]}
          resultCount={rows.length}
        />

        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error)
                ? query.error.userMessage
                : "The queue couldn't be loaded."
            }
            onRetry={() => query.refetch()}
          />
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            getRowKey={(row) => row.id}
            isLoading={query.isPending}
            onRowClick={(row) => router.push(`/reviews/tasks/${row.id}`)}
            emptyState={
              <EmptyState
                icon={<ClipboardCheck />}
                title={status === "under_review" ? "Queue is clear" : "Nothing here"}
                description={
                  status === "under_review"
                    ? "No submissions are waiting. New ones appear here as students submit."
                    : "No submissions match this filter."
                }
              />
            }
          />
        )}
      </Card>
    </div>
  );
}
