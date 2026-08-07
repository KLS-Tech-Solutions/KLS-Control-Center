"use client";

import * as React from "react";
import { CheckCircle2, Send, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/misc";
import { CharacterCounter } from "@/components/ui/form";
import { isApiError } from "@/lib/api/errors";

/**
 * Approve / reject with remarks.
 *
 * Remarks are mandatory on both outcomes because this text is the only thing
 * the student receives. A rejection with no note leaves them guessing what to
 * fix, and an approval with no note tells them nothing about what was good.
 */
export function ReviewPanel({
  onSubmit,
  pending,
  error,
  approveLabel = "Approve",
  rejectLabel = "Request changes",
  disabled = false,
  disabledReason,
}: {
  onSubmit: (status: "approved" | "rejected", remarks: string) => void;
  pending: boolean;
  error?: unknown;
  approveLabel?: string;
  rejectLabel?: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [remarks, setRemarks] = React.useState("");
  const [intent, setIntent] = React.useState<"approved" | "rejected" | null>(null);

  const tooShort = remarks.trim().length < 3;

  if (disabled) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold">Already reviewed</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-body">
          {disabledReason ?? "This submission has already been decided."}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Your decision</h2>
      <p className="mt-1.5 text-[15px] text-body">
        The student sees your remarks exactly as written.
      </p>

      {Boolean(error) && (
        <Alert variant="danger" className="mt-4">
          {isApiError(error)
            ? error.userMessage
            : "The review didn't save. Try again — the student is still waiting."}
        </Alert>
      )}

      <div className="mt-5 flex flex-col gap-2">
        <Field label="Remarks" htmlFor="remarks" required>
          <Textarea
            id="remarks"
            rows={5}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              intent === "rejected"
                ? "Be specific about what to change — this is their only guidance."
                : "A short note on what was done well."
            }
          />
        </Field>
        <CharacterCounter value={remarks} min={3} max={2000} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button
          full
          disabled={pending || tooShort}
          onClick={() => {
            setIntent("approved");
            onSubmit("approved", remarks.trim());
          }}
        >
          <CheckCircle2 />
          {pending && intent === "approved" ? "Approving…" : approveLabel}
        </Button>

        <Button
          variant="danger"
          full
          disabled={pending || tooShort}
          onClick={() => {
            setIntent("rejected");
            onSubmit("rejected", remarks.trim());
          }}
        >
          <XCircle />
          {pending && intent === "rejected" ? "Sending…" : rejectLabel}
        </Button>
      </div>

      {tooShort && (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-muted">
          <Send className="size-3.5" />
          Write remarks to enable both actions.
        </p>
      )}
    </Card>
  );
}
