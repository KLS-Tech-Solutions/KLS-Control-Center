"use client";

import * as React from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useLogin } from "@/hooks/use-session";
import { isApiError } from "@/lib/api/errors";
import { loginSchema, type LoginValues } from "@/lib/validation";

export function LoginForm() {
  const [show, setShow] = React.useState(false);
  const loginMutation = useLogin();

  const form = useZodForm<LoginValues>(loginSchema, {
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });
      })}
    >
      {loginMutation.isError && (
        <Alert variant="danger">
          {isApiError(loginMutation.error)
            ? loginMutation.error.kind === "forbidden"
              ? "This console is for administrators only."
              : loginMutation.error.userMessage
            : "We couldn't sign you in. Try again."}
        </Alert>
      )}

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

      <FormField form={form} name="password" label="Password" required>
        {(field) => (
          <div className="relative">
            <Input
              {...field}
              {...form.register("password")}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        )}
      </FormField>

      <Button type="submit" size="lg" full disabled={loginMutation.isPending}>
        <LogIn />
        {loginMutation.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
