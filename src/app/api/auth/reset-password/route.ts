import { NextResponse, type NextRequest } from "next/server";

import { callBackend } from "../../_session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await callBackend("/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (response === null) {
    return NextResponse.json({ detail: "API unreachable" }, { status: 502 });
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  }

  return NextResponse.json({ ok: true });
}
