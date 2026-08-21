import { apiRequest } from "@/lib/api/client";
import type {
  ActivityLogEntry,
  AnalyticsOverview,
  Certificate,
  LearningChapter,
} from "@/types";

export function listCertificates() {
  return apiRequest<Certificate[]>("/admin/certificates");
}

/** Permanent — the certificate stops verifying publicly. */
export function revokeCertificate(id: string, reason: string) {
  return apiRequest<Certificate>(`/admin/certificates/${id}/revoke`, {
    method: "POST",
    body: { reason },
  });
}

export function getAnalyticsOverview() {
  return apiRequest<AnalyticsOverview>("/admin/analytics/overview");
}

export function listActivityLogs(
  filters: { user_id?: string; module?: string } = {},
) {
  return apiRequest<ActivityLogEntry[]>("/admin/activity-logs", { query: filters });
}



// --- Study notes -------------------------------------------------------------

export function listChapters(domainId?: string) {
  return apiRequest<LearningChapter[]>("/admin/chapters", {
    query: { domain_id: domainId },
  });
}

export function createChapter(body: {
  domain_id: string;
  title: string;
  summary?: string | null;
  order_number: number;
  difficulty: string;
  estimated_minutes: number;
}) {
  return apiRequest<LearningChapter>("/admin/chapters", { method: "POST", body });
}

export function updateChapter(
  id: string,
  body: Partial<{
    title: string;
    summary: string | null;
    order_number: number;
    difficulty: string;
    estimated_minutes: number;
    status: string;
  }>,
) {
  return apiRequest<LearningChapter>(`/admin/chapters/${id}`, {
    method: "PATCH",
    body,
  });
}

export function deleteChapter(id: string) {
  return apiRequest<void>(`/admin/chapters/${id}`, { method: "DELETE" });
}

/** Multipart — the PDF replaces whatever was there before. */
export function uploadChapterPdf(id: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<LearningChapter>(`/admin/chapters/${id}/pdf`, {
    method: "POST",
    formData,
  });
}
