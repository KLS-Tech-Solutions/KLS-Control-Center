import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { SessionNotice } from "@/components/admin/session-notice";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Card className="p-6 sm:p-8">
      <Suspense fallback={null}>
        <SessionNotice />
      </Suspense>

      <h1 className="text-2xl">Administrator sign in</h1>
      <p className="mt-2 text-[15px] text-body">
        Review submissions and manage the KLS Academy programme.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-[13px] text-muted">
        Student accounts cannot sign in here.{" "}
        <Link href="/forgot-password" className="font-medium text-brand hover:underline">
          Forgot your password?
        </Link>
      </p>
    </Card>
  );
}
