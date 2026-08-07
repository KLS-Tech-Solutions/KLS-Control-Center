import { ApiError, parseErrorBody } from "./errors";
import { CLIENT_API_PREFIX } from "./config";

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** JSON body. Ignored when `formData` is present. */
  body?: unknown;
  /** Multipart body — used for screenshot uploads. */
  formData?: FormData;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /** Set false to skip the automatic refresh-and-retry on 401. */
  retryOnUnauthorized?: boolean;
}

/** Prevents a burst of 401s from firing several refresh calls at once. */
let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  refreshInFlight ??= fetch(`${CLIENT_API_PREFIX}/auth/refresh`, {
    method: "POST",
    credentials: "same-origin",
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}


/**
 * A dead session ends in exactly one place. `replace` rather than `push` so the
 * back button cannot return to a screen that will only 401 again.
 */
function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/login")) return;
  window.location.replace("/login?reason=expired");
}

/**
 * The single place the browser makes a request. Everything goes through the
 * Next proxy at /api/proxy, which forwards to FastAPI with the httpOnly JWT
 * attached. On a 401 it refreshes once, then replays the original request.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    formData,
    query,
    signal,
    headers = {},
    retryOnUnauthorized = true,
  } = options;

  const url = new URL(
    `${CLIENT_API_PREFIX}${path}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const init: RequestInit = {
    method,
    signal,
    credentials: "same-origin",
    headers: formData ? headers : { "Content-Type": "application/json", ...headers },
  };
  if (formData) init.body = formData;
  else if (body !== undefined) init.body = JSON.stringify(body);

  let response: Response;
  try {
    response = await fetch(url.toString(), init);
  } catch {
    throw new ApiError({
      message: "Network request failed",
      kind: "network",
      status: 0,
    });
  }

  if (response.status === 401 && retryOnUnauthorized) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retryOnUnauthorized: false });
    }
    // The session is genuinely gone. Send them to sign in rather than letting
    // every screen render its own "unauthorised" error.
    redirectToLogin();
  }

  if (response.status === 401) {
    redirectToLogin();
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    throw parseErrorBody(response.status, payload);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
