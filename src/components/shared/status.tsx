import { CheckCircle2, Clock, FileEdit, RotateCcw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, ReviewStatus, SubmissionStatus } from "@/types";

const submissionMap: Record<
  SubmissionStatus,
  { label: string; variant: "neutral" | "brand" | "success" | "warning" | "danger"; icon: React.ElementType }
> = {
  not_started: { label: "Not started", variant: "neutral", icon: FileEdit },
  draft: { label: "Draft", variant: "neutral", icon: FileEdit },
  submitted: { label: "Submitted", variant: "brand", icon: Clock },
  under_review: { label: "Under review", variant: "warning", icon: Clock },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Needs changes", variant: "danger", icon: RotateCcw },
};

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, variant, icon: Icon } = submissionMap[status];
  return (
    <Badge variant={variant}>
      <Icon />
      {label}
    </Badge>
  );
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const map = {
    pending: { label: "Awaiting review", variant: "warning" as const, icon: Clock },
    approved: { label: "Approved", variant: "success" as const, icon: CheckCircle2 },
    rejected: { label: "Rejected", variant: "danger" as const, icon: XCircle },
  }[status];

  return (
    <Badge variant={map.variant}>
      <map.icon />
      {map.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map = {
    created: { label: "Not paid", variant: "neutral" as const },
    pending: { label: "Processing", variant: "warning" as const },
    success: { label: "Paid", variant: "success" as const },
    failed: { label: "Failed", variant: "danger" as const },
  }[status];

  return <Badge variant={map.variant}>{map.label}</Badge>;
}
