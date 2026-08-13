"use client";

import Link from "next/link";
import {
  Award,
  ClipboardCheck,
  IndianRupee,
  Share2,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";
import { ErrorState, PageHeader, StatCard } from "@/components/shared/primitives";
import { useAnalytics } from "@/hooks/use-admin-data";
import { useSession } from "@/hooks/use-session";
import { isApiError } from "@/lib/api/errors";

export default function OverviewPage() {
  const { data: user } = useSession();
  const query = useAnalytics();

  const firstName = user?.full_name.split(" ")[0] ?? "there";
  const data = query.data;
  const pending = (data?.pending_task_reviews ?? 0) + (data?.pending_linkedin_reviews ?? 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={
          pending > 0
            ? `${pending} submission${pending === 1 ? "" : "s"} are waiting on you. Students can't move forward until they're reviewed.`
            : "Nothing is waiting for review. New submissions appear here as students send them."
        }
      />

      {query.isError ? (
        <Card className="p-6">
          <ErrorState
            message={
              isApiError(query.error)
                ? query.error.userMessage
                : "Couldn't load the overview. Is the API running?"
            }
            onRetry={() => query.refetch()}
          />
        </Card>
      ) : query.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-card" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Task reviews waiting"
              value={data?.pending_task_reviews ?? 0}
              hint="Students blocked until reviewed"
              icon={<ClipboardCheck />}
              tone={data?.pending_task_reviews ? "warning" : "success"}
            />
            <StatCard
              label="LinkedIn posts waiting"
              value={data?.pending_linkedin_reviews ?? 0}
              hint="Blocks all their technical tasks"
              icon={<Share2 />}
              tone={data?.pending_linkedin_reviews ? "warning" : "success"}
            />
            <StatCard
              label="Students"
              value={data?.students_total ?? 0}
              hint="Registered on the platform"
              icon={<Users />}
            />
            <StatCard
              label="Certificates issued"
              value={data?.certificates_issued ?? 0}
              hint={`₹${((data?.revenue_paise ?? 0) / 100).toLocaleString("en-IN")} collected`}
              icon={<Award />}
              tone="success"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Where students are</h2>
              <p className="mt-1 text-[15px] text-body">
                Anyone stuck in a review stage is waiting on this team.
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {Object.entries(data?.students_by_stage ?? {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([stage, count]) => {
                    const total = data?.students_total || 1;
                    const percent = Math.round((count / total) * 100);
                    return (
                      <li key={stage} className="flex items-center gap-3">
                        <span className="w-44 shrink-0 text-[13px] capitalize text-body">
                          {stage.replaceAll("_", " ")}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-pill bg-line-soft">
                          <div
                            className="h-full rounded-pill bg-brand-gradient"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 shrink-0 text-right text-[13px] font-semibold text-ink">
                          {count}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold">Jump in</h2>
              <p className="mt-1 text-[15px] text-body">
                Start with whatever is blocking a student.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/reviews/tasks"
                  className={cn(buttonVariants({ full: true }))}
                >
                  <ClipboardCheck />
                  Review task submissions
                  {(data?.pending_task_reviews ?? 0) > 0 && ` (${data?.pending_task_reviews})`}
                </Link>
                <Link
                  href="/reviews/linkedin"
                  className={cn(buttonVariants({ variant: "secondary", full: true }))}
                >
                  <Share2 />
                  Review LinkedIn posts
                  {(data?.pending_linkedin_reviews ?? 0) > 0 &&
                    ` (${data?.pending_linkedin_reviews})`}
                </Link>
                <Link
                  href="/students"
                  className={cn(buttonVariants({ variant: "ghost", full: true }))}
                >
                  <Users />
                  Browse students
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-field bg-canvas p-4">
                <IndianRupee className="size-5 shrink-0 text-muted" />
                <p className="text-[15px] leading-relaxed text-body">
                  Revenue is the certificate issuance fee only — the internship itself
                  is free.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
