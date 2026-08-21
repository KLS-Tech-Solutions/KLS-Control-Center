"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, Mail, Phone } from "lucide-react";

import { formatDate, formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { SubmissionStatusBadge } from "@/components/shared/status";
import { ErrorState, PageHeader, StageBadge } from "@/components/shared/primitives";
import type { StudentJourney } from "@/types";
import { useStudent } from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";

export default function StudentDetailPage() {
  const params = useParams<{ studentId: string }>();
  const query = useStudent(params.studentId);

  if (query.isPending) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 rounded-card" />
        <Skeleton className="h-80 rounded-card" />
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
                : "This student couldn't be loaded."
            }
            onRetry={() => query.refetch()}
          />
        </Card>
      </div>
    );
  }

  const journey = query.data;
  const technical = journey.tasks.filter((t) => t.order_number > 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        All students
      </Link>

      <PageHeader
        title={journey.user.full_name}
        description="The same record the student sees on their own dashboard."
        action={<StageBadge stage={journey.stage} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Avatar name={journey.user.full_name} className="size-14 text-lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{journey.user.full_name}</p>
                <p className="text-[13px] text-muted">
                  Joined {formatDate(journey.user.created_at)}
                </p>
              </div>
            </div>

            <dl className="mt-5 flex flex-col gap-3 text-[15px]">
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-muted" />
                <span className="truncate text-body">{journey.user.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-muted" />
                <span className="text-body">{journey.user.phone}</span>
              </div>
            </dl>

            {journey.profile && (
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-[13px] font-semibold text-ink">Education</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-body">
                  {[
                    journey.profile.degree,
                    journey.profile.branch,
                    journey.profile.year,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Not provided"}
                </p>
                <p className="mt-1 text-[15px] text-body">
                  {journey.profile.college_name ?? "College not provided"}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {journey.profile.linkedin_url && (
                    <a
                      href={journey.profile.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                    >
                      LinkedIn <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  {journey.profile.github_url && (
                    <a
                      href={journey.profile.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                    >
                      GitHub <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </Card>

          {journey.offerLetter && (
            <Card className="p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <FileText className="size-4" />
              </span>
              <h2 className="mt-4 text-[15px] font-semibold">Offer letter</h2>
              <p className="mt-1 font-mono text-sm text-body">
                {journey.offerLetter.offer_letter_number}
              </p>
              <p className="mt-1 text-[13px] text-muted">
                Generated {formatDate(journey.offerLetter.generated_at)}
              </p>
              <Badge
                variant={journey.offerLetter.linkedin_verified ? "success" : "warning"}
                className="mt-3"
              >
                LinkedIn {journey.offerLetter.linkedin_verified ? "verified" : "pending"}
              </Badge>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Internship</h2>
            {journey.domain ? (
              <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-[15px]">
                <div>
                  <dt className="text-[13px] text-muted">Domain</dt>
                  <dd className="mt-0.5 font-medium text-ink">{journey.domain.title}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Batch</dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {journey.batch?.batch_name ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Duration</dt>
                  <dd className="mt-0.5 font-medium text-ink">{journey.domain.duration}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Enrolled</dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {formatDate(journey.enrollment?.enrolled_at)}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-[15px] text-body">
                Not enrolled in an internship yet.
              </p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Task progress</h2>
            {technical.length === 0 ? (
              <p className="mt-3 text-[15px] text-body">No tasks assigned yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {technical.map((task) => {
                  const submission = journey.submissions.find(
                    (s) => s.task_id === task.id,
                  );
                  return (
                    <li key={task.id} className="flex items-center gap-4 py-3.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-sm font-semibold text-body">
                        {task.order_number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium text-ink">
                          {task.title}
                        </p>
                        {submission?.submitted_at && (
                          <p className="text-[13px] text-muted">
                            Submitted {formatDateTime(submission.submitted_at)}
                            {submission.attempt > 1 && ` · attempt ${submission.attempt}`}
                          </p>
                        )}
                      </div>
                      {submission ? (
                        <Link href={`/reviews/tasks/${submission.id}`}>
                          <SubmissionStatusBadge status={submission.status} />
                        </Link>
                      ) : (
                        <SubmissionStatusBadge status="not_started" />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <InternshipHistory history={journey.history} />
        </div>
      </div>
    </div>
  );
}

/**
 * Every internship this student has taken, not just the one in progress.
 *
 * The page previously showed only the current enrolment, so a reviewer looking
 * at someone on their second internship could not see that they had already
 * completed one — which is exactly the context you want when judging their
 * work.
 */
function InternshipHistory({
  history,
}: {
  history: StudentJourney["history"];
}) {
  if (history.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-[15px] font-semibold">Internships</h2>
        <p className="mt-2 text-[15px] text-body">
          This student has not enrolled in anything yet.
        </p>
      </Card>
    );
  }

  const completed = history.filter((h) => h.certificate_number).length;

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold">Internships</h2>
        <p className="text-[13px] text-muted">
          {history.length} taken · {completed} completed
        </p>
      </div>

      <ol className="mt-5 flex flex-col gap-4">
        {history.map((entry) => (
          <li
            key={entry.enrollment_id}
            className="rounded-field border border-line p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-ink">{entry.domain_title}</p>
              {entry.is_current && <Badge variant="brand">Current</Badge>}
              {entry.certificate_number ? (
                <Badge variant="success">Completed</Badge>
              ) : (
                <Badge variant="warning">In progress</Badge>
              )}
            </div>

            <p className="mt-1 text-[13px] text-muted">
              {entry.batch_name}
              {entry.duration ? ` · ${entry.duration}` : ""} · Enrolled{" "}
              {formatDate(entry.enrolled_at)}
              {entry.completed_at
                ? ` · Completed ${formatDate(entry.completed_at)}`
                : ""}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[13px]">
              <span className="text-body">
                <span className="font-semibold text-ink">
                  {entry.tasks_approved}/{entry.tasks_total}
                </span>{" "}
                tasks approved
              </span>
              {entry.offer_letter_number && (
                <span className="font-mono text-muted">
                  {entry.offer_letter_number}
                </span>
              )}
              {entry.certificate_number && (
                <span className="font-mono text-success">
                  {entry.certificate_number}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
