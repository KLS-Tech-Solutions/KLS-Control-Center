"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, KeyRound, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { isApiError } from "@/lib/api/errors";
import { requestPasswordReset, resetPassword } from "@/services/auth.service";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues,
} from "@/lib/validation";

export function ForgotPasswordForm() {
  const [sent, setSent] = React.useState(false);
  const form = useZodForm<ForgotPasswordValues>(forgotPasswordSchema, {
    defaultValues: { email: "" },
  });

  if (sent) {
    return (
      <div className="mt-6 rounded-field bg-accent-50 p-5 text-center">
        <CheckCircle2 className="mx-auto size-6 text-accent" />
        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          If that email belongs to an administrator, a reset link is on its way. The
          link expires in 30 minutes.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(async ({ email }) => {
        await requestPasswordReset(email);
        setSent(true);
      })}
    >
      <FormField form={form} name="email" label="Email" required>
        {(field) => (
          <Input
            {...field}
            {...form.register("email")}
            type="email"
            autoComplete="email"
            placeholder="admin@klstechsolutions.in"
          />
        )}
      </FormField>

      <Button type="submit" size="lg" full disabled={form.formState.isSubmitting}>
        <Send />
        {form.formState.isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);

  const form = useZodForm<ResetPasswordValues>(resetPasswordSchema, {
    defaultValues: {
      token: params.get("token") ?? "",
      password: "",
      confirm_password: "",
    },
  });

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        try {
          await resetPassword({ token: values.token, password: values.password });
          toast({ title: "Password updated", variant: "success" });
          router.push("/login");
        } catch (err) {
          setError(
            isApiError(err) ? err.userMessage : "That reset link is no longer valid.",
          );
        }
      })}
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <input type="hidden" {...form.register("token")} />

      <FormField
        form={form}
        name="password"
        label="New password"
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

      <FormField form={form} name="confirm_password" label="Confirm new password" required>
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
        {form.formState.isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
