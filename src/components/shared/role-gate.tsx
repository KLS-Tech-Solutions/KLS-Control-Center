"use client";

import * as React from "react";
import { ShieldAlert } from "lucide-react";

import { can, type Capability } from "@/types";
import { useSession } from "@/hooks/use-session";
import { Card } from "@/components/ui/card";

/**
 * Hides UI the signed-in role cannot use.
 *
 * This is convenience, not security — the backend rejects the same calls with
 * a 403 regardless. Never rely on this alone.
 */
export function RoleGate({
  capability,
  children,
  fallback = null,
}: {
  capability: Capability;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { data: user } = useSession();
  if (!can(user?.role, capability)) return <>{fallback}</>;
  return <>{children}</>;
}

/** Full-page version for routes a role may not open at all. */
export function RequireCapability({
  capability,
  children,
}: {
  capability: Capability;
  children: React.ReactNode;
}) {
  const { data: user, isPending } = useSession();

  if (isPending) return null;

  if (!can(user?.role, capability)) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <Card className="p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-warning-bg text-warning">
            <ShieldAlert className="size-6" />
          </span>
          <h1 className="mt-5 text-xl font-semibold">Super administrator only</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-body">
            Your account can review submissions and read records, but not change this.
            Ask a super administrator if you need access.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
