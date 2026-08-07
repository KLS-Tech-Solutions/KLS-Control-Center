import { apiRequest } from "@/lib/api/client";
import type { InternshipBatch, InternshipDomain, Task } from "@/types";

/* --- Domains --------------------------------------------------------------- */

export function listDomains() {
  return apiRequest<InternshipDomain[]>("/internship-domains", {
    query: { status_filter: "all" },
  });
}

export function createDomain(input: Partial<InternshipDomain>) {
  return apiRequest<InternshipDomain>("/admin/internship-domains", {
    method: "POST",
    body: input,
  });
}

export function updateDomain(id: string, input: Partial<InternshipDomain>) {
  return apiRequest<InternshipDomain>(`/admin/internship-domains/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteDomain(id: string) {
  return apiRequest<void>(`/admin/internship-domains/${id}`, { method: "DELETE" });
}

/* --- Batches --------------------------------------------------------------- */

export function listBatches(domainId?: string) {
  return apiRequest<InternshipBatch[]>("/internship-batches", {
    query: { domain_id: domainId },
  });
}

export function createBatch(input: Partial<InternshipBatch>) {
  return apiRequest<InternshipBatch>("/admin/internship-batches", {
    method: "POST",
    body: input,
  });
}

export function updateBatch(id: string, input: Partial<InternshipBatch>) {
  return apiRequest<InternshipBatch>(`/admin/internship-batches/${id}`, {
    method: "PATCH",
    body: input,
  });
}

/* --- Tasks ----------------------------------------------------------------- */

export function listTasks(batchId: string) {
  return apiRequest<Task[]>("/admin/tasks", { query: { batch_id: batchId } });
}

export function createTask(input: Partial<Task> & { batch_id: string }) {
  return apiRequest<Task>("/admin/tasks", { method: "POST", body: input });
}

export function updateTask(id: string, input: Partial<Task>) {
  return apiRequest<Task>(`/admin/tasks/${id}`, { method: "PATCH", body: input });
}

export function deleteTask(id: string) {
  return apiRequest<void>(`/admin/tasks/${id}`, { method: "DELETE" });
}

/**
 * POST /admin/tasks/reorder
 *
 * Rewrites order_number from the supplied sequence. Students are locked
 * task-by-task behind the previous approval, so resequencing a batch that is
 * already running changes what is open to them — warn before calling this.
 */
export function reorderTasks(batchId: string, taskIds: string[]) {
  return apiRequest<Task[]>("/admin/tasks/reorder", {
    method: "POST",
    query: { batch_id: batchId },
    body: { task_ids: taskIds },
  });
}
