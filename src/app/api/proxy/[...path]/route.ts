import { NextResponse, type NextRequest } from "next/server";

import { callBackend } from "../../_session";

/**
 * Transparent pass-through to FastAPI with the admin token attached from the
 * httpOnly cookie. Nothing here interprets the payload — it exists purely so
 * the JWT never has to be readable by JavaScript.
 */
async function handler(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const target = `/${path.join("/")}${request.nextUrl.search}`;

  const isMultipart = request.headers
    .get("content-type")
    ?.includes("multipart/form-data");

  const init: RequestInit & { authenticated: boolean } = {
    method: request.method,
    authenticated: true,
    headers: isMultipart
      ? {}
      : {
          "Content-Type":
            request.headers.get("content-type") ?? "application/json",
        },
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = isMultipart ? await request.formData() : await request.text();
  }

  let response: Response;
  try {
    response = await callBackend(target, init);
  } catch {
    return NextResponse.json(
      { detail: "Upstream service unavailable" },
      { status: 502 },
    );
  }

  const payload = await response.text();
  return new NextResponse(payload || null, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
};
