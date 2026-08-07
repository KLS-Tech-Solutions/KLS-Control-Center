import { apiRequest } from "@/lib/api/client";
import type {
  LinkedInSubmission,
  ReviewStatus,
  SubmissionStatus,
  TaskSubmission,
} from "@/types";

/* --- LinkedIn queue -------------------------------------------------------- */

/** GET /admin/linkedin-submissions */
export function listLinkedInSubmissions(status?: ReviewStatus) {
  return apiRequest<LinkedInSubmission[]>("/admin/linkedin-submissions", {
    query: { status },
  });
}

/** PATCH /admin/linkedin-submissions/{id} */
export function reviewLinkedInSubmission(
  id: string,
  input: { status: Exclude<ReviewStatus, "pending">; remarks: string },
) {
  return apiRequest<LinkedInSubmission>(`/admin/linkedin-submissions/${id}`, {
    method: "PATCH",
    body: input,
  });
}

/* --- Task queue ------------------------------------------------------------ */

export interface TaskSubmissionFilters {
  [key: string]: string | undefined;
  status?: SubmissionStatus;
  batch_id?: string;
  task_id?: string;
  student_id?: string;
}

/** GET /admin/task-submissions */
export function listTaskSubmissions(filters: TaskSubmissionFilters = {}) {
  return apiRequest<TaskSubmission[]>("/admin/task-submissions", { query: filters });
}

/** GET /admin/task-submissions/{id} */
export function getTaskSubmission(id: string) {
  return apiRequest<TaskSubmission>(`/admin/task-submissions/${id}`);
}

/**
 * POST /admin/task-submissions/{id}/review
 *
 * This is the call that moves a student forward. `remarks` is the only
 * feedback they receive, so it is required on both outcomes.
 */
export function reviewTaskSubmission(
  id: string,
  input: { status: Exclude<ReviewStatus, "pending">; remarks: string },
) {
  return apiRequest<TaskSubmission>(`/admin/task-submissions/${id}/review`, {
    method: "POST",
    body: input,
  });
}
