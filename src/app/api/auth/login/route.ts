import { NextResponse, type NextRequest } from "next/server";

import { callBackend, isAdminRole, setSessionCookies } from "../../_session";

/**
 * Exchanges credentials for tokens and stores them as httpOnly cookies.
 *
 * A student account authenticates successfully against the shared backend, so
 * the role is checked here and the session is refused before any cookie is
 * written. The backend enforces the same rule on every /admin route.
 */
export async function POST(request: NextRequest) {
  const credentials = await request.json();

  const response = await callBackend("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).catch(() => null);

  if (response === null) {
    return NextResponse.json(
      { detail: "Could not reach the API. Is the backend running?" },
      { status: 502 },
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  if (!isAdminRole(payload?.user?.role)) {
    return NextResponse.json(
      { detail: "This console is for administrators only" },
      { status: 403 },
    );
  }

  await setSessionCookies(payload);
  return NextResponse.json({ user: payload.user });
}
