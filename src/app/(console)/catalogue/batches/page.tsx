"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarRange, ListOrdered, Plus } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { RequireCapability } from "@/components/shared/role-gate";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import { useBatches, useCreateBatch, useDomains } from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import { batchSchema, type BatchValues } from "@/lib/validation";
import type { InternshipBatch } from "@/types";

export default function BatchesPage() {
  return (
    <RequireCapability capability="manageCatalogue">
      <Batches />
    </RequireCapability>
  );
}

function Batches() {
  const domains = useDomains();
  const query = useBatches();
  const create = useCreateBatch();
  const { toast } = useToast();
  const [creating, setCreating] = React.useState(false);

  const domainName = (id: string) =>
    domains.data?.find((d) => d.id === id)?.title ?? "—";

  const columns: Column<InternshipBatch>[] = [
    {
      key: "name",
      header: "Batch",
      sortValue: (row) => row.batch_name,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{row.batch_name}</p>
          <p className="truncate text-[13px] text-muted">{domainName(row.domain_id)}</p>
        </div>
      ),
    },
    {
      key: "dates",
      header: "Runs",
      sortValue: (row) => row.start_date,
      render: (row) => (
        <span className="whitespace-nowrap text-[13px] text-body">
          {formatDate(row.start_date)} — {formatDate(row.end_date)}
        </span>
      ),
    },
    {
      key: "seats",
      header: "Seats",
      sortValue: (row) => row.seats_left,
      render: (row) => (
        <span className="text-[15px] text-body">
          {row.seats_left} / {row.seats_total}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      render: (row) => (
        <Badge
          variant={
            row.status === "ongoing" ? "success" : row.status === "closed" ? "neutral" : "brand"
          }
          className="capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <Link href={`/catalogue/batches/${row.id}/tasks`}>
          <Button variant="ghost" size="sm">
            <ListOrdered />
            Tasks
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Batches"
        description="Each domain runs in batches. Tasks are configured per batch."
        action={
          <div className="flex gap-2">
            <Link href="/catalogue/domains">
              <Button variant="secondary">Domains</Button>
            </Link>
            <Button onClick={() => setCreating(true)}>
              <Plus />
              New batch
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden p-0">
        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error) ? query.error.userMessage : "Couldn't load batches."
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
                icon={<CalendarRange />}
                title="No batches yet"
                description="Create a batch so students have something to enrol in."
              />
            }
          />
        )}
      </Card>

      {creating && (
        <BatchDialog
          domains={domains.data ?? []}
          pending={create.isPending}
          error={create.error}
          onClose={() => setCreating(false)}
          onSubmit={async (values) => {
            try {
              await create.mutateAsync(values as never);
              toast({ title: "Batch created", variant: "success" });
              setCreating(false);
            } catch {
              // The dialog renders the error.
            }
          }}
        />
      )}
    </div>
  );
}

function BatchDialog({
  domains,
  onClose,
  onSubmit,
  pending,
  error,
}: {
  domains: { id: string; title: string }[];
  onClose: () => void;
  onSubmit: (values: BatchValues) => void;
  pending: boolean;
  error?: unknown;
}) {
  const form = useZodForm<BatchValues>(batchSchema, {
    defaultValues: {
      domain_id: domains[0]?.id ?? "",
      batch_name: "",
      start_date: "",
      end_date: "",
      seats_total: 50,
      status: "upcoming",
    },
  });

  return (
    <Dialog
      open
      onClose={onClose}
      title="New batch"
      description="Students enrol into a batch, and its tasks become their assignments."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button disabled={pending} onClick={form.handleSubmit((v) => onSubmit(v))}>
            {pending ? "Creating…" : "Create batch"}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" noValidate>
        {Boolean(error) && (
          <Alert variant="danger">
            {isApiError(error) ? error.userMessage : "Couldn't create the batch."}
          </Alert>
        )}

        <FormField form={form} name="domain_id" label="Domain" required>
          {(field) => (
            <Select {...field} {...form.register("domain_id")}>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.title}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField form={form} name="batch_name" label="Batch name" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("batch_name")}
              placeholder="Full Stack Python — Batch 02"
            />
          )}
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField form={form} name="start_date" label="Start date" required>
            {(field) => <Input {...field} {...form.register("start_date")} type="date" />}
          </FormField>

          <FormField form={form} name="end_date" label="End date" required>
            {(field) => <Input {...field} {...form.register("end_date")} type="date" />}
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField form={form} name="seats_total" label="Seats" required>
            {(field) => (
              <Input {...field} {...form.register("seats_total")} type="number" min={1} />
            )}
          </FormField>

          <FormField form={form} name="status" label="Status" required>
            {(field) => (
              <Select {...field} {...form.register("status")}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="closed">Closed</option>
              </Select>
            )}
          </FormField>
        </div>
      </form>
    </Dialog>
  );
}
