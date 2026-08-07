"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, FolderGit2, History, User as UserIcon } from "lucide-react";

import { cn, formatDateTime } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { SubmissionStatusBadge } from "@/components/shared/status";
import { ErrorState, PageHeader } from "@/components/shared/primitives";
import { ReviewPanel } from "@/components/admin/review-panel";
import { ScreenshotGallery } from "@/components/admin/screenshot-gallery";
import { useReviewTask, useTaskSubmission } from "@/hooks/use-reviews";
import { isApiError } from "@/lib/api/errors";

export default function TaskSubmissionReviewPage() {
  const params = useParams<{ submissionId: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const query = useTaskSubmission(params.submissionId);
  const review = useReviewTask();

  if (query.isPending) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-96 rounded-card" />
          <Skeleton className="h-64 rounded-card" />
        </div>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-6">
          <ErrorState
            message={
              isApiError(query.error)
                ? query.error.userMessage
                : "This submission couldn't be loaded."
            }
            onRetry={() => query.refetch()}
          />
        </Card>
      </div>
    );
  }

  const submission = query.data;
  const decided = ["approved", "rejected"].includes(submission.status);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Link
        href="/reviews/tasks"
        className="inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        Back to queue
      </Link>

      <PageHeader
        title={submission.title}
        description={`Submitted ${formatDateTime(submission.submitted_at)}`}
        action={
          <div className="flex items-center gap-2">
            {submission.attempt > 1 && (
              <Badge variant="warning">Attempt {submission.attempt}</Badge>
            )}
            <SubmissionStatusBadge status={submission.status} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">What they built</h2>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-body">
              {submission.description}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">
              Screenshots ({submission.screenshots.length})
            </h2>
            <ScreenshotGallery screenshots={submission.screenshots} className="mt-4" />
          </Card>

          {submission.review && (
            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <History className="size-4 text-muted" />
                Previous decision
              </h2>
              <div className="mt-4 rounded-field bg-canvas p-4">
                <p className="text-[15px] leading-relaxed text-body">
                  {submission.review.remarks}
                </p>
                <p className="mt-2 text-[13px] text-muted">
                  {submission.review.status} · {formatDateTime(submission.review.reviewed_at)}
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold">Links</h2>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={submission.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-start gap-2 break-all text-[15px] font-medium text-brand hover:underline"
              >
                <FolderGit2 className="mt-0.5 size-4 shrink-0" />
                {submission.github_url}
              </a>
              {submission.live_demo_url && (
                <a
                  href={submission.live_demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2 break-all text-[15px] font-medium text-brand hover:underline"
                >
                  <ExternalLink className="mt-0.5 size-4 shrink-0" />
                  {submission.live_demo_url}
                </a>
              )}
            </div>

            <Link
              href={`/students/${submission.student_id}`}
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm", full: true }),
                "mt-5",
              )}
            >
              <UserIcon />
              View student record
            </Link>
          </Card>

          <ReviewPanel
            pending={review.isPending}
            error={review.error}
            disabled={decided}
            disabledReason={
              decided
                ? `This submission was already ${submission.status}. The student has been notified.`
                : undefined
            }
            onSubmit={async (status, remarks) => {
              try {
                await review.mutateAsync({ id: submission.id, status, remarks });
                toast({
                  title: status === "approved" ? "Approved" : "Changes requested",
                  description: "The student has been notified.",
                  variant: "success",
                });
                router.push("/reviews/tasks");
              } catch {
                // The panel renders the error — the student is still waiting.
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
