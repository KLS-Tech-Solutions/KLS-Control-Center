import { cookies } from "next/headers";

import {
  AUTH_COOKIE,
  COOKIE_SECURE,
  REFRESH_COOKIE,
  SERVER_API_BASE_URL,
} from "@/lib/api/config";

/**
 * Server-side session helpers. Tokens live in httpOnly cookies and are only
 * read here — nothing in the browser bundle can reach them.
 */

const baseCookie = {
  httpOnly: true as const,
  secure: COOKIE_SECURE,
  sameSite: "lax" as const,
  path: "/",
};

export interface TokenPair {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export async function setSessionCookies(tokens: TokenPair) {
  const store = await cookies();

  store.set(AUTH_COOKIE, tokens.access_token, {
    ...baseCookie,
    maxAge: tokens.expires_in ?? 60 * 30,
  });

  if (tokens.refresh_token) {
    store.set(REFRESH_COOKIE, tokens.refresh_token, {
      ...baseCookie,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken() {
  return (await cookies()).get(AUTH_COOKIE)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}

export async function callBackend(
  path: string,
  init: RequestInit & { authenticated?: boolean } = {},
) {
  const { authenticated = false, headers, ...rest } = init;
  const token = authenticated ? await getAccessToken() : null;

  return fetch(`${SERVER_API_BASE_URL}${path}`, {
    ...rest,
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
}

export const ADMIN_ROLES = ["admin", "super_admin"];

export function isAdminRole(role: unknown): boolean {
  return typeof role === "string" && ADMIN_ROLES.includes(role);
}
