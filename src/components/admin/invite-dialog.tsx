"use client";

import * as React from "react";
import { Check, Copy, Mail, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { SpamNote } from "@/components/shared/spam-note";
import { isApiError } from "@/lib/api/errors";
import { inviteAdminSchema, type InviteAdminValues } from "@/lib/validation";
import type { AdminInviteResult } from "@/types";

export function InviteDialog({
  open,
  onClose,
  onSubmit,
  pending,
  error,
  result,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: InviteAdminValues) => void;
  pending: boolean;
  error?: unknown;
  result: AdminInviteResult | null;
}) {
  const [copied, setCopied] = React.useState(false);

  const form = useZodForm<InviteAdminValues>(inviteAdminSchema, {
    defaultValues: { full_name: "", email: "", role: "admin" },
  });

  React.useEffect(() => {
    if (open) {
      form.reset();
      setCopied(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* --- The invite was created ------------------------------------------- */
  if (result) {
    return (
      <Dialog
        open
        onClose={onClose}
        title="Invitation created"
        description={`${result.admin.full_name} can now set their own password.`}
        footer={<Button onClick={onClose}>Done</Button>}
      >
        {result.email_delivered ? (
          <Alert variant="success" icon={<Mail />} title="Invitation emailed">
            Sent to {result.admin.email}. The link expires in 7 days.
          </Alert>
        ) : (
          <Alert variant="warning" title="Email isn't configured">
            Send this link to {result.admin.email} yourself. It expires in 7 days and
            works once.
          </Alert>
        )}

        {/* Always shown. Even with email working, a new sending domain often
            lands in spam — the inviter needs a link they can pass on. */}
        <div className="mt-4 flex items-center gap-2 rounded-field border border-line bg-canvas p-3">
          <code className="min-w-0 flex-1 truncate text-[13px] text-ink">
            {result.invite_url}
          </code>
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              if (!result.invite_url) return;
              await navigator.clipboard.writeText(result.invite_url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {result.email_delivered && (
          <SpamNote className="mt-4" action="invitation" />
        )}

        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          No password has been set. They choose their own from this link, so nothing
          usable travels through email or chat.
        </p>
      </Dialog>
    );
  }

  /* --- The form ---------------------------------------------------------- */
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Invite an administrator"
      description="They'll receive a link to set their own password. No account is active until they use it."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button disabled={pending} onClick={form.handleSubmit((v) => onSubmit(v))}>
            <UserPlus />
            {pending ? "Creating…" : "Send invitation"}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" noValidate>
        {Boolean(error) && (
          <Alert variant="danger">
            {isApiError(error) ? error.userMessage : "Couldn't create the invitation."}
          </Alert>
        )}

        <FormField form={form} name="full_name" label="Full name" required>
          {(field) => (
            <Input {...field} {...form.register("full_name")} placeholder="Priya Sharma" />
          )}
        </FormField>

        <FormField form={form} name="email" label="Email" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("email")}
              type="email"
              placeholder="priya@klstechsolutions.in"
            />
          )}
        </FormField>

        <FormField
          form={form}
          name="role"
          label="Role"
          required
          hint="Administrators review submissions. Super administrators also manage the catalogue and revoke certificates."
        >
          {(field) => (
            <Select {...field} {...form.register("role")}>
              <option value="admin">Administrator</option>
              <option value="super_admin">Super administrator</option>
            </Select>
          )}
        </FormField>
      </form>
    </Dialog>
  );
}
