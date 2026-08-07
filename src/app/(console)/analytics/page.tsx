"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, ClipboardCheck, IndianRupee, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";
import { ErrorState, PageHeader, StatCard } from "@/components/shared/primitives";
import { useAnalytics } from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";

const STAGE_LABELS: Record<string, string> = {
  not_enrolled: "Not enrolled",
  enrolled: "Enrolled",
  offer_letter_generated: "Offer letter",
  linkedin_submitted: "LinkedIn sent",
  linkedin_approved: "LinkedIn approved",
  tasks_in_progress: "Tasks in progress",
  all_tasks_approved: "Tasks approved",
  payment_pending: "Payment pending",
  paid: "Paid",
  certificate_issued: "Certified",
};

const STAGE_ORDER = Object.keys(STAGE_LABELS);

export default function AnalyticsPage() {
  const query = useAnalytics();

  if (query.isPending) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-card" />
          ))}
        </div>
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
                : "Analytics couldn't be loaded."
            }
            onRetry={() => query.refetch()}
          />
        </Card>
      </div>
    );
  }

  const data = query.data;

  const funnel = STAGE_ORDER.filter(
    (stage) => (data.students_by_stage[stage] ?? 0) > 0,
  ).map((stage) => ({
    stage: STAGE_LABELS[stage],
    students: data.students_by_stage[stage] ?? 0,
  }));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Where students are in the journey, and where they stall."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value={data.students_total} icon={<Users />} />
        <StatCard
          label="Awaiting review"
          value={data.pending_task_reviews + data.pending_linkedin_reviews}
          icon={<ClipboardCheck />}
          tone={
            data.pending_task_reviews + data.pending_linkedin_reviews > 0
              ? "warning"
              : "success"
          }
        />
        <StatCard
          label="Certificates"
          value={data.certificates_issued}
          icon={<Award />}
          tone="success"
        />
        <StatCard
          label="Revenue"
          value={`₹${(data.revenue_paise / 100).toLocaleString("en-IN")}`}
          hint="₹50 per certificate"
          icon={<IndianRupee />}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Journey funnel</h2>
        <p className="mt-1 text-[15px] text-body">
          A tall bar on a review stage means students are waiting on this team.
        </p>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnel} margin={{ top: 8, right: 8, bottom: 60, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-line)"
                vertical={false}
              />
              <XAxis
                dataKey="stage"
                angle={-35}
                textAnchor="end"
                interval={0}
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                stroke="var(--color-line)"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                stroke="var(--color-line)"
              />
              <Tooltip
                cursor={{ fill: "var(--color-brand-50)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--color-line)",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="students" fill="var(--color-brand)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
