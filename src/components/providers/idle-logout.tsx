"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast";
import { useIdleLogout } from "@/hooks/use-idle-logout";
import { logout } from "@/services/auth.service";

/**
 * Mounted inside the console, so it only runs for a signed-in administrator.
 * Clears the httpOnly session on the server, wipes the cached query data, then
 * sends them to sign in again with an explanation.
 */
export function IdleLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const signingOut = React.useRef(false);

  const handleIdle = React.useCallback(async () => {
    if (signingOut.current) return;
    signingOut.current = true;

    await logout().catch(() => null);
    queryClient.clear();
    router.replace("/login?reason=timeout");
  }, [queryClient, router]);

  const handleWarning = React.useCallback(
    (seconds: number) => {
      toast({
        title: "You'll be signed out shortly",
        description: `For your security, we sign you out after 30 minutes of inactivity. About ${Math.round(seconds / 60)} minute(s) left — move the mouse to stay signed in.`,
        variant: "info",
      });
    },
    [toast],
  );

  useIdleLogout({ enabled: true, onIdle: handleIdle, onWarning: handleWarning });

  return null;
}
