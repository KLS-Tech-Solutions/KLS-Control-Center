"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";

import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/table";
import { FilterBar } from "@/components/ui/filter-bar";
import { PaymentStatusBadge } from "@/components/shared/status";
import {
  EmptyState,
  ErrorState,
  PageHeader,
  StatCard,
} from "@/components/shared/primitives";
import { CertificateFeeCard } from "@/components/admin/certificate-fee-card";
import { usePayments } from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import type { Payment, PaymentStatus } from "@/types";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "success", label: "Paid" },
  { value: "created", label: "Started" },
  { value: "failed", label: "Failed" },
];

export default function PaymentsPage() {
  const [status, setStatus] = React.useState("");
  const query = usePayments(status ? (status as PaymentStatus) : undefined);

  const rows = query.data ?? [];
  const collected = rows
    .filter((p) => p.payment_status === "success")
    .reduce((total, p) => total + p.amount, 0);

  const columns: Column<Payment>[] = [
    {
      key: "transaction",
      header: "Transaction",
      sortValue: (row) => row.transaction_id ?? "",
      render: (row) => (
        <span className="font-mono text-[13px] text-ink">
          {row.transaction_id ?? "—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortValue: (row) => row.amount,
      render: (row) => (
        <span className="font-medium text-ink">
          {formatCurrency(row.amount / 100)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.payment_status,
      render: (row) => <PaymentStatusBadge status={row.payment_status} />,
    },
    {
      key: "paid",
      header: "Paid at",
      sortValue: (row) => row.paid_at ?? "",
      render: (row) => (
        <span className="whitespace-nowrap text-[13px] text-body">
          {row.paid_at ? formatDateTime(row.paid_at) : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Payments"
        description="Certificate issuance fees. The internship itself is free."
      />

      <CertificateFeeCard />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Collected"
          value={formatCurrency(collected / 100)}
          icon={<CreditCard />}
          tone="success"
        />
        <StatCard
          label="Successful"
          value={rows.filter((p) => p.payment_status === "success").length}
        />
        <StatCard
          label="Failed"
          value={rows.filter((p) => p.payment_status === "failed").length}
          tone="danger"
        />
      </div>

      <Card className="overflow-hidden p-0">
        <FilterBar
          filters={[
            { label: "Status", value: status, options: STATUS_OPTIONS, onChange: setStatus },
          ]}
          resultCount={rows.length}
        />

        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error) ? query.error.userMessage : "Couldn't load payments."
            }
            onRetry={() => query.refetch()}
          />
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            getRowKey={(row) => row.id}
            isLoading={query.isPending}
            emptyState={
              <EmptyState
                icon={<CreditCard />}
                title="No payments yet"
                description="Payments appear once a student has every task approved."
              />
            }
          />
        )}
      </Card>
    </div>
  );
}
