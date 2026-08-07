import { apiRequest } from "@/lib/api/client";
import { ApiError, parseErrorBody } from "@/lib/api/errors";
import type {
  AdminAccount,
  AdminInviteResult,
  InvitePreview,
  UserRole,
  UserStatus,
} from "@/types";

/** GET /admin/admins */
export function listAdmins() {
  return apiRequest<AdminAccount[]>("/admin/admins");
}

/**
 * POST /admin/admins/invite
 *
 * No password is ever set by the inviter — the invitee chooses their own from
 * the link, so a working credential never travels by email or chat.
 */
export function inviteAdmin(input: {
  full_name: string;
  email: string;
  role: UserRole;
}) {
  return apiRequest<AdminInviteResult>("/admin/admins/invite", {
    method: "POST",
    body: input,
  });
}

/** PATCH /admin/admins/{id} */
export function updateAdmin(
  id: string,
  input: { role?: UserRole; status?: UserStatus },
) {
  return apiRequest<AdminAccount>(`/admin/admins/${id}`, {
    method: "PATCH",
    body: input,
  });
}

/* --- Public invite acceptance ---------------------------------------------
   These run before a session exists, so they go through the unauthenticated
   proxy rather than the admin API client.
   ------------------------------------------------------------------------- */

async function publicRequest<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/proxy${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError({ message: "Network request failed", kind: "network", status: 0 });
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) throw parseErrorBody(response.status, payload);
  return payload as T;
}

export function previewInvite(token: string) {
  return publicRequest<InvitePreview>(`/auth/invite/${encodeURIComponent(token)}`);
}

export function acceptInvite(input: { token: string; password: string }) {
  return publicRequest<void>("/auth/accept-invite", input);
}
