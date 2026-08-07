import { NextResponse } from "next/server";

import { callBackend, clearSessionCookies } from "../../_session";

export async function POST() {
  // Best effort — the session is cleared locally regardless.
  await callBackend("/auth/logout", { method: "POST", authenticated: true }).catch(
    () => null,
  );
  await clearSessionCookies();
  return NextResponse.json({ ok: true });
}
