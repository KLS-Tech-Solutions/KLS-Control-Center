"use client";

import * as React from "react";
import { Award, ExternalLink, Ban } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { RoleGate } from "@/components/shared/role-gate";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import { useCertificates, useRevokeCertificate } from "@/hooks/use-admin-data";
import { ACADEMY_URL } from "@/lib/api/config";
import { isApiError } from "@/lib/api/errors";
import type { Certificate } from "@/types";

export default function CertificatesPage() {
  const query = useCertificates();
  const revoke = useRevokeCertificate();
  const { toast } = useToast();
  const [target, setTarget] = React.useState<Certificate | null>(null);

  const columns: Column<Certificate>[] = [
    {
      key: "number",
      header: "Certificate",
      sortValue: (row) => row.certificate_number,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-mono text-[13px] font-medium text-ink">
            {row.certificate_number}
          </p>
          <p className="truncate text-[13px] text-muted">{row.domain_title}</p>
        </div>
      ),
    },
    {
      key: "student",
      header: "Student",
      sortValue: (row) => row.student_name,
      render: (row) => <span className="text-[15px] text-ink">{row.student_name}</span>,
    },
    {
      key: "issued",
      header: "Issued",
      sortValue: (row) => row.issued_at,
      render: (row) => (
        <span className="whitespace-nowrap text-[13px] text-body">
          {formatDate(row.issued_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <a
            href={`${ACADEMY_URL}/verify/${row.certificate_number}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline"
          >
            Verify <ExternalLink className="size-3.5" />
          </a>
          <RoleGate capability="revokeCertificates">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTarget(row)}
              className="text-danger hover:bg-danger-bg"
            >
              <Ban />
              Revoke
            </Button>
          </RoleGate>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Certificates"
        description="Every issued credential. Revoking one stops it verifying publicly."
      />

      <Card className="overflow-hidden p-0">
        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error)
                ? query.error.userMessage
                : "Couldn't load certificates."
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
                icon={<Award />}
                title="No certificates issued"
                description="A certificate is generated once a student finishes every task and pays."
              />
            }
          />
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="Revoke this certificate?"
        description={
          target
            ? `${target.certificate_number} will stop verifying publicly. Anyone checking it will be told it is not valid.`
            : ""
        }
        confirmLabel="Revoke certificate"
        destructive
        requireReason
        reasonLabel="Reason for revocation"
        reasonHint="Recorded in the audit log."
        pending={revoke.isPending}
        onConfirm={async (reason) => {
          if (!target) return;
          try {
            await revoke.mutateAsync({ id: target.id, reason });
            toast({ title: "Certificate revoked", variant: "success" });
            setTarget(null);
          } catch (error) {
            toast({
              title: "Couldn't revoke",
              description: isApiError(error) ? error.userMessage : "Try again.",
              variant: "error",
            });
          }
        }}
      />
    </div>
  );
}
