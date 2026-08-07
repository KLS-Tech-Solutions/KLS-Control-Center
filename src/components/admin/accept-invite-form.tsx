"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/misc";
import { Alert } from "@/components/ui/misc";
import { FormField, useZodForm } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { acceptInvite, previewInvite } from "@/services/admins.service";
import { isApiError } from "@/lib/api/errors";
import { acceptInviteSchema, type AcceptInviteValues } from "@/lib/validation";

export function AcceptInviteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const token = params.get("token") ?? "";

  const [error, setError] = React.useState<string | null>(null);

  const preview = useQuery({
    queryKey: ["invite", token],
    queryFn: () => previewInvite(token),
    enabled: Boolean(token),
    retry: false,
  });

  const form = useZodForm<AcceptInviteValues>(acceptInviteSchema, {
    defaultValues: { token, password: "", confirm_password: "" },
  });

  if (!token) {
    return <InvalidInvite message="This link is missing its invitation token." />;
  }

  if (preview.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-72" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (preview.isError || !preview.data) {
    return (
      <InvalidInvite
        message={
          isApiError(preview.error)
            ? preview.error.userMessage
            : "This invitation is no longer valid."
        }
      />
    );
  }

  const invitee = preview.data;
  const roleLabel =
    invitee.role === "super_admin" ? "Super administrator" : "Administrator";

  return (
    <>
      <h1 className="text-2xl">Welcome, {invitee.full_name.split(" ")[0]}</h1>
      <p className="mt-2 text-[15px] text-body">
        Choose a password to activate your KLS Academy admin account.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-field bg-canvas p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-ink">{invitee.email}</p>
          <p className="text-[13px] text-muted">Your sign-in email</p>
        </div>
        <Badge variant="brand">{roleLabel}</Badge>
      </div>

      <form
        className="mt-6 flex flex-col gap-5"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          setError(null);
          try {
            await acceptInvite({ token: values.token, password: values.password });
            toast({
              title: "Account activated",
              description: "Sign in with your new password.",
              variant: "success",
            });
            router.push("/login");
          } catch (err) {
            setError(
              isApiError(err)
                ? err.userMessage
                : "That invitation could not be accepted.",
            );
          }
        })}
      >
        {error && <Alert variant="danger">{error}</Alert>}

        <input type="hidden" {...form.register("token")} />

        <FormField
          form={form}
          name="password"
          label="Choose a password"
          required
          hint="At least 8 characters, with a number and a letter."
        >
          {(field) => (
            <Input
              {...field}
              {...form.register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          )}
        </FormField>

        <FormField form={form} name="confirm_password" label="Confirm password" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("confirm_password")}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          )}
        </FormField>

        <Button type="submit" size="lg" full disabled={form.formState.isSubmitting}>
          <KeyRound />
          {form.formState.isSubmitting ? "Activating…" : "Activate my account"}
        </Button>
      </form>

      <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-muted">
        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-accent" />
        Only you will know this password — nobody at KLS set one for you.
      </p>
    </>
  );
}

function InvalidInvite({ message }: { message: string }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-warning-bg text-warning">
        <ShieldAlert className="size-6" />
      </span>
      <h1 className="mt-5 text-xl font-semibold">This invitation isn&apos;t valid</h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-body">
        {message} Invitations expire after 7 days and can only be used once — ask a super
        administrator to send a new one.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-semibold text-brand hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}
