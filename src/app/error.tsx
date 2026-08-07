"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-5">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl">Something went wrong</h1>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-body">
          An unexpected error interrupted this page. Try again — if it keeps happening,
          check that the API is running.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted">Ref: {error.digest}</p>
        )}
        <Button onClick={reset} className="mt-8">
          <RefreshCw />
          Try again
        </Button>
      </div>
    </div>
  );
}
