import type { Metadata } from "next";
import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";
import { AcceptInviteForm } from "@/components/admin/accept-invite-form";

export const metadata: Metadata = { title: "Accept your invitation" };

export default function AcceptInvitePage() {
  return (
    <Card className="p-6 sm:p-8">
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <AcceptInviteForm />
      </Suspense>
    </Card>
  );
}
