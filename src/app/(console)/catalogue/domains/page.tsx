"use client";

import * as React from "react";
import Link from "next/link";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { RequireCapability } from "@/components/shared/role-gate";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import { DomainFormDialog } from "@/components/admin/domain-form";
import {
  useCreateDomain,
  useDeleteDomain,
  useDomains,
  useUpdateDomain,
} from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import type { InternshipDomain } from "@/types";

export default function DomainsPage() {
  return (
    <RequireCapability capability="manageCatalogue">
      <Domains />
    </RequireCapability>
  );
}

function Domains() {
  const query = useDomains();
  const create = useCreateDomain();
  const update = useUpdateDomain();
  const remove = useDeleteDomain();
  const { toast } = useToast();

  const [editing, setEditing] = React.useState<InternshipDomain | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<InternshipDomain | null>(null);

  const columns: Column<InternshipDomain>[] = [
    {
      key: "title",
      header: "Domain",
      sortValue: (row) => row.title,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{row.title}</p>
          <p className="truncate font-mono text-[13px] text-muted">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "difficulty",
      header: "Level",
      sortValue: (row) => row.difficulty,
      render: (row) => (
        <Badge variant="neutral" className="capitalize">
          {row.difficulty}
        </Badge>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      sortValue: (row) => row.duration,
      render: (row) => <span className="text-[15px] text-body">{row.duration}</span>,
    },
    {
      key: "tasks",
      header: "Tasks",
      sortValue: (row) => row.task_count,
      render: (row) => (
        <span className="text-[15px] text-body">{row.task_count}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "neutral"}>
          {row.status === "active" ? "Live" : "Hidden"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>
            <Pencil />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleting(row)}
            className="text-danger hover:bg-danger-bg"
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Catalogue"
        description="Internship domains students can enrol in. Task counts vary by domain."
        action={
          <div className="flex gap-2">
            <Link href="/catalogue/batches">
              <Button variant="secondary">Batches</Button>
            </Link>
            <Button onClick={() => setCreating(true)}>
              <Plus />
              New domain
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden p-0">
        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error) ? query.error.userMessage : "Couldn't load domains."
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
                icon={<Layers />}
                title="No domains yet"
                description="Create the first internship domain students can enrol in."
                action={
                  <Button onClick={() => setCreating(true)}>
                    <Plus />
                    New domain
                  </Button>
                }
              />
            }
          />
        )}
      </Card>

      {creating && (
        <DomainFormDialog
          open
          onClose={() => setCreating(false)}
          pending={create.isPending}
          error={create.error}
          onSubmit={async (values) => {
            try {
              await create.mutateAsync({
                ...values,
                display_order: Number(values.display_order),
                image_url: values.image_url || null,
                outcomes: [],
                skills: [],
              });
              toast({ title: "Domain created", variant: "success" });
              setCreating(false);
            } catch {
              // The dialog renders the error.
            }
          }}
        />
      )}

      {editing && (
        <DomainFormDialog
          open
          domain={editing}
          onClose={() => setEditing(null)}
          pending={update.isPending}
          error={update.error}
          onSubmit={async (values) => {
            try {
              await update.mutateAsync({
                id: editing.id,
                input: {
                  ...values,
                  display_order: Number(values.display_order),
                  image_url: values.image_url || null,
                },
              });
              toast({ title: "Domain updated", variant: "success" });
              setEditing(null);
            } catch {
              // The dialog renders the error.
            }
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this domain?"
        description={
          deleting
            ? `${deleting.title} and its batches will be removed. If students are enrolled, the API will refuse — hide it instead.`
            : ""
        }
        confirmLabel="Delete domain"
        destructive
        pending={remove.isPending}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.id);
            toast({ title: "Domain deleted", variant: "success" });
            setDeleting(null);
          } catch (error) {
            toast({
              title: "Couldn't delete",
              description: isApiError(error)
                ? error.userMessage
                : "Try hiding it instead.",
              variant: "error",
            });
            setDeleting(null);
          }
        }}
      />
    </div>
  );
}
