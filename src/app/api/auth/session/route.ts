import { NextResponse } from "next/server";

import { callBackend, getAccessToken, isAdminRole } from "../../_session";

/** Who am I? Drives the route guard and role-filtered navigation. */
export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const response = await callBackend("/auth/me", { authenticated: true }).catch(
    () => null,
  );

  if (response === null) {
    return NextResponse.json({ detail: "API unreachable" }, { status: 502 });
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  if (!isAdminRole(payload?.user?.role)) {
    return NextResponse.json({ detail: "Not an administrator" }, { status: 403 });
  }

  return NextResponse.json(payload);
}
