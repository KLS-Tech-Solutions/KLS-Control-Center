"use client";

import * as React from "react";
import { ShieldCheck, UserPlus, Users } from "lucide-react";

import { formatDate, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";
import { DataTable, type Column } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { RequireCapability } from "@/components/shared/role-gate";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import { InviteDialog } from "@/components/admin/invite-dialog";
import { useAdmins, useInviteAdmin, useUpdateAdmin } from "@/hooks/use-admins";
import { useSession } from "@/hooks/use-session";
import { isApiError } from "@/lib/api/errors";
import type { AdminAccount, AdminInviteResult, UserRole } from "@/types";

export default function TeamPage() {
  return (
    <RequireCapability capability="manageCatalogue">
      <Team />
    </RequireCapability>
  );
}

function Team() {
  const { data: me } = useSession();
  const query = useAdmins();
  const invite = useInviteAdmin();
  const update = useUpdateAdmin();
  const { toast } = useToast();

  const [inviting, setInviting] = React.useState(false);
  const [result, setResult] = React.useState<AdminInviteResult | null>(null);

  const columns: Column<AdminAccount>[] = [
    {
      key: "name",
      header: "Administrator",
      sortValue: (row) => row.full_name,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} className="size-9" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">
              {row.full_name}
              {row.id === me?.id && (
                <span className="ml-2 text-[13px] font-normal text-muted">(you)</span>
              )}
            </p>
            <p className="truncate text-[13px] text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortValue: (row) => row.role,
      render: (row) =>
        row.id === me?.id ? (
          <Badge variant="solid">
            {row.role === "super_admin" ? "Super admin" : "Admin"}
          </Badge>
        ) : (
          <Select
            value={row.role}
            className="h-9 w-auto min-w-[9rem]"
            disabled={update.isPending}
            onChange={(e) =>
              changeRole(row, e.target.value as UserRole)
            }
          >
            <option value="admin">Administrator</option>
            <option value="super_admin">Super administrator</option>
          </Select>
        ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      render: (row) => (
        <Badge
          variant={
            row.status === "active"
              ? "success"
              : row.status === "pending"
                ? "warning"
                : "danger"
          }
          className="capitalize"
        >
          {row.status === "pending" ? "Invited" : row.status}
        </Badge>
      ),
    },
    {
      key: "last_login",
      header: "Last signed in",
      sortValue: (row) => row.last_login_at ?? "",
      render: (row) => (
        <span className="whitespace-nowrap text-[13px] text-body">
          {row.last_login_at ? formatDateTime(row.last_login_at) : "Never"}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Added",
      sortValue: (row) => row.created_at,
      render: (row) => (
        <span className="whitespace-nowrap text-[13px] text-body">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) =>
        row.id === me?.id ? null : (
          <Button
            variant="ghost"
            size="sm"
            disabled={update.isPending}
            onClick={() =>
              changeStatus(row, row.status === "suspended" ? "active" : "suspended")
            }
            className={row.status === "suspended" ? "" : "text-danger hover:bg-danger-bg"}
          >
            {row.status === "suspended" ? "Reinstate" : "Suspend"}
          </Button>
        ),
    },
  ];

  async function changeRole(admin: AdminAccount, role: UserRole) {
    try {
      await update.mutateAsync({ id: admin.id, input: { role } });
      toast({ title: `${admin.full_name} is now a ${role.replace("_", " ")}`, variant: "success" });
    } catch (error) {
      toast({
        title: "Couldn't change the role",
        description: isApiError(error) ? error.userMessage : "Try again.",
        variant: "error",
      });
    }
  }

  async function changeStatus(admin: AdminAccount, status: "active" | "suspended") {
    try {
      await update.mutateAsync({ id: admin.id, input: { status } });
      toast({
        title: status === "suspended" ? "Access suspended" : "Access restored",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Couldn't update access",
        description: isApiError(error) ? error.userMessage : "Try again.",
        variant: "error",
      });
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Team"
        description="Who can sign in to this console, and what each of them can do."
        action={
          <Button onClick={() => setInviting(true)}>
            <UserPlus />
            Invite administrator
          </Button>
        }
      />

      <Card className="flex gap-4 bg-canvas p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="text-[15px] font-semibold text-ink">
            Invitees choose their own password
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-body">
            An invitation creates a pending account with no usable password. Nothing
            works until they open the link and set one themselves, so a credential never
            travels through email or chat.
          </p>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {query.isError ? (
          <ErrorState
            message={
              isApiError(query.error) ? query.error.userMessage : "Couldn't load the team."
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
                icon={<Users />}
                title="No administrators"
                description="Invite the first administrator to share the review workload."
              />
            }
          />
        )}
      </Card>

      <InviteDialog
        open={inviting || Boolean(result)}
        result={result}
        pending={invite.isPending}
        error={invite.error}
        onClose={() => {
          setInviting(false);
          setResult(null);
          invite.reset();
        }}
        onSubmit={async (values) => {
          try {
            const created = await invite.mutateAsync({
              full_name: values.full_name,
              email: values.email,
              role: values.role as UserRole,
            });
            setResult(created);
            setInviting(false);
          } catch {
            // The dialog renders the error.
          }
        }}
      />
    </div>
  );
}
