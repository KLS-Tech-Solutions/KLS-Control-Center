/**
 * Browser requests go to the Next proxy, never to FastAPI directly. The proxy
 * attaches the JWT from an httpOnly cookie, so no admin token is reachable
 * from JavaScript.
 */
export const CLIENT_API_PREFIX = "/api/proxy";

/** Server-only. Used by route handlers to reach FastAPI. */
export const SERVER_API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8000/api/v1";

export const AUTH_COOKIE = "kls_admin_access";
export const REFRESH_COOKIE = "kls_admin_refresh";
export const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

export const ACADEMY_URL =
  process.env.NEXT_PUBLIC_ACADEMY_URL ?? "http://localhost:3000";
