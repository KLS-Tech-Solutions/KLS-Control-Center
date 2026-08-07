import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/admin/password-forms";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-2xl">Reset your password</h1>
      <p className="mt-2 text-[15px] text-body">
        Enter your administrator email and we&apos;ll send a reset link.
      </p>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-[15px] text-body">
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
