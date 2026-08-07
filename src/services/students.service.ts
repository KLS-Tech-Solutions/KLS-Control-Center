import { apiRequest } from "@/lib/api/client";
import type { AdminStudentSummary, StudentJourney } from "@/types";

/** GET /admin/students */
export function listStudents(filters: { search?: string; batch_id?: string } = {}) {
  return apiRequest<AdminStudentSummary[]>("/admin/students", { query: filters });
}

/**
 * GET /admin/students/{id}
 *
 * Returns the identical `StudentJourney` shape the student's own dashboard
 * renders from, so a reviewer sees exactly what the student sees.
 */
export function getStudent(id: string) {
  return apiRequest<StudentJourney>(`/admin/students/${id}`);
}
