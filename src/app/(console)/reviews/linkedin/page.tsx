"use client";

import * as React from "react";
import { CheckCircle2, ExternalLink, Share2 } from "lucide-react";

import { formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";
import { FilterBar } from "@/components/ui/filter-bar";
import { useToast } from "@/components/ui/toast";
import { ReviewStatusBadge } from "@/components/shared/status";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import { ReviewPanel } from "@/components/admin/review-panel";
import { useLinkedInQueue, useReviewLinkedIn } from "@/hooks/use-reviews";
import { isApiError } from "@/lib/api/errors";
import type { ReviewStatus } from "@/types";

const STATUS_OPTIONS = [
  { value: "pending", label: "Awaiting review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All statuses" },
];

export default function LinkedInQueuePage() {
  const [status, setStatus] = React.useState<string>("pending");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const query = useLinkedInQueue(status ? (status as ReviewStatus) : undefined);
  const review = useReviewLinkedIn();

  const submissions = query.data ?? [];
  const selected =
    submissions.find((s) => s.id === selectedId) ?? submissions[0] ?? null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="LinkedIn reviews"
        description="Approving a post unlocks every technical task for that student. This is the first gate in the journey."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Card className="overflow-hidden p-0">
          <FilterBar
            filters={[
              { label: "Status", value: status, options: STATUS_OPTIONS, onChange: setStatus },
            ]}
            resultCount={submissions.length}
          />

          {query.isPending ? (
            <div className="flex flex-col gap-2 p-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <ErrorState
              message={
                isApiError(query.error)
                  ? query.error.userMessage
                  : "The queue couldn't be loaded."
              }
              onRetry={() => query.refetch()}
            />
          ) : submissions.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 />}
              title={status === "pending" ? "Queue is clear" : "Nothing here"}
              description={
                status === "pending"
                  ? "No posts are waiting for verification."
                  : "No submissions match this filter."
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {submissions.map((submission) => {
                const active = selected?.id === submission.id;
                return (
                  <li key={submission.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(submission.id)}
                      className={`flex w-full flex-col gap-1.5 px-4 py-4 text-left transition-colors ${
                        active ? "bg-brand-50/60" : "hover:bg-canvas/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-[15px] font-medium text-ink">
                          {submission.linkedin_post_url.replace("https://www.", "")}
                        </span>
                        <ReviewStatusBadge status={submission.status} />
                      </div>
                      <span className="text-[13px] text-muted">
                        Submitted {formatDateTime(submission.submitted_at)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {selected ? (
          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                <Share2 className="size-5" />
              </span>
              <h2 className="mt-5 text-lg font-semibold">The post</h2>
              <a
                href={selected.linkedin_post_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-start gap-2 break-all text-[15px] font-medium text-brand hover:underline"
              >
                {selected.linkedin_post_url}
                <ExternalLink className="mt-0.5 size-4 shrink-0" />
              </a>

              <div className="mt-6 rounded-field bg-canvas p-4">
                <p className="text-[13px] font-semibold text-ink">What to check</p>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-[15px] leading-relaxed text-body">
                  <li>The post is public, not connections-only</li>
                  <li>It contains their offer letter</li>
                  <li>KLS Tech Solutions is tagged</li>
                </ul>
              </div>

              {selected.admin_comment && (
                <div className="mt-4 rounded-field bg-canvas p-4">
                  <p className="text-[13px] text-muted">Previous comment</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-body">
                    {selected.admin_comment}
                  </p>
                </div>
              )}
            </Card>

            <ReviewPanel
              pending={review.isPending}
              error={review.error}
              approveLabel="Approve and unlock tasks"
              rejectLabel="Reject"
              disabled={selected.status !== "pending"}
              disabledReason={
                selected.status !== "pending"
                  ? `This post was already ${selected.status}.`
                  : undefined
              }
              onSubmit={async (decision, remarks) => {
                try {
                  await review.mutateAsync({
                    id: selected.id,
                    status: decision,
                    remarks,
                  });
                  toast({
                    title:
                      decision === "approved" ? "Approved — tasks unlocked" : "Rejected",
                    description: "The student has been notified.",
                    variant: "success",
                  });
                  setSelectedId(null);
                } catch {
                  // The panel renders the error.
                }
              }}
            />
          </div>
        ) : (
          <Card className="p-6">
            <EmptyState
              icon={<Share2 />}
              title="Select a submission"
              description="Choose a post from the queue to review it."
            />
          </Card>
        )}
      </div>
    </div>
  );
}
