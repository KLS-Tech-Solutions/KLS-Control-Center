"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useSession } from "@/hooks/use-session";

/**
 * Client-side guard. The real protection is the httpOnly cookie the API
 * requires and the role check in the login route — this only spares an
 * unauthenticated visitor a flash of empty chrome before the redirect.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useSession();

  React.useEffect(() => {
    if (!isPending && !user) router.replace("/login");
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <span className="flex items-center gap-3 text-[15px] text-body">
          <Loader2 className="size-5 animate-spin text-brand" />
          Checking your session…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
