"use client";

import { ShieldCheck } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { PageHeader } from "@/components/shared/primitives";
import { useSession } from "@/hooks/use-session";
import { ROLE_CAPABILITIES, can, type Capability } from "@/types";

const CAPABILITY_LABELS: Record<Capability, string> = {
  review: "Review LinkedIn and task submissions",
  viewStudents: "View student records",
  viewMoney: "View students and certificates",
  manageCatalogue: "Create and edit domains, batches and tasks",
  revokeCertificates: "Revoke issued certificates",
  readActivityLogs: "Read activity logs",
};

export default function ProfilePage() {
  const { data: user, isPending } = useSession();

  if (isPending || !user) {
    return <Skeleton className="h-64 w-full max-w-2xl rounded-card" />;
  }

  const roleLabel = user.role === "super_admin" ? "Super administrator" : "Administrator";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader title="Your account" description="Your administrator details and access." />

      <Card className="flex flex-wrap items-center gap-5 p-6">
        <Avatar name={user.full_name} className="size-16 text-lg" />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-ink">{user.full_name}</p>
          <p className="text-[15px] text-body">{user.email}</p>
          <p className="mt-1 text-[13px] text-muted">
            Member since {formatDate(user.created_at)}
          </p>
        </div>
        <Badge variant="solid" className="ml-auto">
          {roleLabel}
        </Badge>
      </Card>

      <Card className="p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="size-4 text-muted" />
          What you can do
        </h2>
        <p className="mt-1 text-[15px] text-body">
          The API enforces this — the interface only mirrors it.
        </p>

        <ul className="mt-5 flex flex-col gap-3">
          {(Object.keys(ROLE_CAPABILITIES) as Capability[]).map((capability) => {
            const allowed = can(user.role, capability);
            return (
              <li
                key={capability}
                className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
              >
                <span
                  className={allowed ? "text-[15px] text-ink" : "text-[15px] text-muted"}
                >
                  {CAPABILITY_LABELS[capability]}
                </span>
                <Badge variant={allowed ? "success" : "neutral"}>
                  {allowed ? "Allowed" : "Super admin only"}
                </Badge>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
