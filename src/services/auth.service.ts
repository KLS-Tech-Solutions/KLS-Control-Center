import { ApiError, parseErrorBody } from "@/lib/api/errors";
import type { User } from "@/types";

/**
 * Auth calls hit the Next route handlers rather than the proxy, because those
 * handlers are what set and clear the httpOnly session cookies — and what
 * refuse a student account before any cookie is written.
 */
async function authRequest<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/auth/${path}`, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError({ message: "Network request failed", kind: "network", status: 0 });
  }

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) throw parseErrorBody(response.status, payload);
  return payload as T;
}

export function login(values: { email: string; password: string }) {
  return authRequest<{ user: User }>("login", values);
}

export function logout() {
  return authRequest<{ ok: true }>("logout", {});
}

export function requestPasswordReset(email: string) {
  return authRequest<{ ok: true }>("forgot-password", { email });
}

export function resetPassword(values: { token: string; password: string }) {
  return authRequest<{ ok: true }>("reset-password", values);
}

/** Returns null rather than throwing when nobody is signed in. */
export async function getSession(): Promise<User | null> {
  try {
    const { user } = await authRequest<{ user: User }>("session");
    return user;
  } catch (error) {
    if (error instanceof ApiError && ["unauthorized", "forbidden"].includes(error.kind)) {
      return null;
    }
    throw error;
  }
}
