/* ==========================================================================
   One error taxonomy for the whole app. Screens branch on `kind`, never on
   raw status codes, so backend changes don't ripple into components.
   ========================================================================== */

export type ApiErrorKind =
  | "network"        // request never reached the server
  | "unauthorized"   // 401 — session missing or expired
  | "forbidden"      // 403 — signed in, not allowed
  | "not_found"      // 404
  | "validation"     // 422 — field-level errors from FastAPI
  | "conflict"       // 409 — e.g. already enrolled
  | "rate_limited"   // 429
  | "server"         // 5xx
  | "unknown";

/** FastAPI returns 422 as { detail: [{ loc, msg, type }] }. */
export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly fieldErrors: FieldError[];
  readonly detail: unknown;

  constructor(init: {
    message: string;
    kind: ApiErrorKind;
    status: number;
    fieldErrors?: FieldError[];
    detail?: unknown;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.kind = init.kind;
    this.status = init.status;
    this.fieldErrors = init.fieldErrors ?? [];
    this.detail = init.detail;
  }

  /** Copy safe to show a student — never leaks stack traces or SQL. */
  get userMessage() {
    switch (this.kind) {
      case "network":
        return "We couldn't reach the server. Check your connection and try again.";
      case "unauthorized":
        return "Your session has expired. Sign in again to continue.";
      case "forbidden":
        return "You don't have access to this.";
      case "not_found":
        return "We couldn't find what you were looking for.";
      case "validation":
        return this.fieldErrors[0]?.message ?? "Some details need fixing.";
      case "conflict":
        return this.message;
      case "rate_limited":
        return "Too many attempts. Wait a moment and try again.";
      case "server":
        return "Something went wrong on our side. Please try again shortly.";
      default:
        return "Something unexpected happened. Please try again.";
    }
  }
}

export function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
}

/** Normalises FastAPI's several error shapes into ours. */
export function parseErrorBody(status: number, body: unknown): ApiError {
  const kind = kindFromStatus(status);

  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;

    // 422 — array of validation issues
    if (Array.isArray(detail)) {
      const fieldErrors: FieldError[] = detail.map((issue) => {
        const loc = Array.isArray(issue?.loc) ? issue.loc : [];
        return {
          field: String(loc[loc.length - 1] ?? "form"),
          message: String(issue?.msg ?? "Invalid value"),
        };
      });
      return new ApiError({
        message: fieldErrors[0]?.message ?? "Validation failed",
        kind: "validation",
        status,
        fieldErrors,
        detail,
      });
    }

    if (typeof detail === "string") {
      return new ApiError({ message: detail, kind, status, detail });
    }
  }

  return new ApiError({ message: `Request failed with status ${status}`, kind, status, detail: body });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
