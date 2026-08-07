import type { Metadata } from "next";
import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/admin/password-forms";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-2xl">Set a new password</h1>
      <p className="mt-2 text-[15px] text-body">
        Choose a password you haven&apos;t used before.
      </p>

      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </Card>
  );
}
