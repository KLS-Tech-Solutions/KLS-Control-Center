"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

/**
 * Confirmation for destructive or irreversible actions. When `requireReason`
 * is set the action stays disabled until a reason is typed — used for
 * certificate revocation, which cannot be undone.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  pending = false,
  requireReason = false,
  reasonLabel = "Reason",
  reasonHint,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonHint?: string;
}) {
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const blocked = requireReason && reason.trim().length < 3;

  return (
    <Dialog
      open={open}
      onClose={pending ? () => {} : onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={() => onConfirm(reason.trim())}
            disabled={pending || blocked}
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </>
      }
    >
      {destructive && (
        <div className="mb-4 flex gap-3 rounded-field bg-danger-bg p-4 text-danger">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-relaxed">This cannot be undone.</p>
        </div>
      )}

      {requireReason && (
        <Field label={reasonLabel} htmlFor="confirm-reason" required hint={reasonHint}>
          <Textarea
            id="confirm-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why…"
          />
        </Field>
      )}
    </Dialog>
  );
}
