"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/table";
import { FilterBar } from "@/components/ui/filter-bar";
import { Avatar } from "@/components/ui/misc";
import {
  EmptyState,
  ErrorState,
  PageHeader,
  StageBadge,
} from "@/components/shared/primitives";
import { useStudents } from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import type { AdminStudentSummary } from "@/types";

const STAGE_OPTIONS = [
  { value: "", label: "All stages" },
  { value: "linkedin_submitted", label: "Awaiting LinkedIn review" },
  { value: "tasks_in_progress", label: "Working on tasks" },
  { value: "all_tasks_approved", label: "Ready to pay" },
  { value: "certificate_issued", label: "Completed" },
];

export default function StudentsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [stage, setStage] = React.useState("");

  const query = useStudents(search.trim() ? { search: search.trim() } : {});

  const rows = React.useMemo(() => {
    const all = query.data ?? [];
    return stage ? all.filter((s) => s.stage === stage) : all;
  }, [query.data, stage]);

  const columns: Column<AdminStudentSummary>[] = [
    {
      key: "name",
      header: "Student",
      sortValue: (row) => row.full_name,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} className="size-9" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{row.full_name}</p>
            <p className="truncate text-[13px] text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "stage",
      header: "Stage",
      sortValue: (row) => row.stage,
      render: (row) => <StageBadge stage={row.stage} />,
    },
    {
      key: "phone",
      header: "Phone",
      render: (row) => <span className="text-[15px] text-body">{row.phone}</span>,
    },
    {
      key: "verified",
      header: "Email",
      sortValue: (row) => String(row.email_verified),
      render: (row) => (
        <span className="text-[13px] text-body">
          {row.email_verified ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      sortValue: (row) => row.created_at,
      render: (row) => (
        <span className="whitespace-nowrap text-[13px] text-body">
          {formatDate(row.created_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Students"
        description="The stage column shows exactly where each student is — and who is waiting on a review."
      />

      <Card className="overflow-hidden p-0">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or email…"
          filters={[
            { label: "Stage", value: stage, options: STAGE_OPTIONS, onChange: setStage },
          ]}
          resultCount={rows.length}
        />

        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error)
                ? query.error.userMessage
                : "Students couldn't be loaded."
            }
            onRetry={() => query.refetch()}
          />
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            getRowKey={(row) => row.id}
            isLoading={query.isPending}
            onRowClick={(row) => router.push(`/students/${row.id}`)}
            emptyState={
              <EmptyState
                icon={<Users />}
                title="No students found"
                description="Try a different search, or clear the stage filter."
              />
            }
          />
        )}
      </Card>
    </div>
  );
}
