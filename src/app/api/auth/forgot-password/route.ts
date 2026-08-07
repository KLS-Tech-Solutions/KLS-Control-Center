import { NextResponse, type NextRequest } from "next/server";

import { callBackend } from "../../_session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await callBackend("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);

  // Always succeed — never reveal whether an email is registered.
  return NextResponse.json({ ok: true }, { status: response?.ok ? 200 : 200 });
}
