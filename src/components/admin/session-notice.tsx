"use client";

import { useSearchParams } from "next/navigation";
import { Clock, LogIn } from "lucide-react";

import { Alert } from "@/components/ui/misc";

/**
 * Explains why someone landed back on the sign-in screen. Without this an
 * automatic sign-out looks like the app losing their work for no reason.
 */
export function SessionNotice() {
  const reason = useSearchParams().get("reason");

  if (reason === "timeout") {
    return (
      <Alert variant="info" icon={<Clock />} className="mb-6">
        You were signed out after 30 minutes of inactivity. Sign in to pick up where you
        left off — nothing you submitted has been lost.
      </Alert>
    );
  }

  if (reason === "expired") {
    return (
      <Alert variant="info" icon={<LogIn />} className="mb-6">
        Your session expired. Sign in again to continue.
      </Alert>
    );
  }

  return null;
}
