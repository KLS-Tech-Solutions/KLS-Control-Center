import { apiRequest } from "@/lib/api/client";
import type {
  ActivityLogEntry,
  AnalyticsOverview,
  Certificate,
  Payment,
  PaymentStatus,
  PlatformSettings,
} from "@/types";

export function listPayments(status?: PaymentStatus) {
  return apiRequest<Payment[]>("/admin/payments", { query: { status } });
}

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

/**
 * Operational settings. Readable by any admin; only a super admin may change
 * the fee, which the API enforces regardless of what the console renders.
 */
export function getPlatformSettings() {
  return apiRequest<PlatformSettings>("/admin/settings");
}

export function updateCertificateFee(amountPaise: number) {
  return apiRequest<PlatformSettings>("/admin/settings/certificate-fee", {
    method: "PATCH",
    body: { amount_paise: amountPaise },
  });
}
