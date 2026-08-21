"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { getStudent, listStudents } from "@/services/students.service";
import {
  createBatch,
  createDomain,
  createTask,
  deleteDomain,
  deleteTask,
  listBatches,
  listDomains,
  listTasks,
  reorderTasks,
  updateBatch,
  updateDomain,
  updateTask,
} from "@/services/catalogue.service";
import {
  getAnalyticsOverview,
  createChapter,
  deleteChapter,
  listActivityLogs,
  listChapters,
  updateChapter,
  uploadChapterPdf,
  listCertificates,
  revokeCertificate,
} from "@/services/ops.service";
import type { InternshipBatch, InternshipDomain, Task } from "@/types";

/* --- Students -------------------------------------------------------------- */

export function useStudents(filters: { search?: string; batch_id?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.students.list(filters),
    queryFn: () => listStudents(filters),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => getStudent(id),
    enabled: Boolean(id),
  });
}

/* --- Catalogue ------------------------------------------------------------- */

export function useDomains() {
  return useQuery({ queryKey: queryKeys.catalogue.domains, queryFn: listDomains });
}

export function useBatches(domainId?: string) {
  return useQuery({
    queryKey: queryKeys.catalogue.batches(domainId),
    queryFn: () => listBatches(domainId),
  });
}

export function useTasks(batchId: string) {
  return useQuery({
    queryKey: queryKeys.catalogue.tasks(batchId),
    queryFn: () => listTasks(batchId),
    enabled: Boolean(batchId),
  });
}

function useCatalogueInvalidator() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.catalogue.all });
}

export function useCreateDomain() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({
    mutationFn: (input: Partial<InternshipDomain>) => createDomain(input),
    onSuccess: invalidate,
  });
}

export function useUpdateDomain() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<InternshipDomain> }) =>
      updateDomain(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteDomain() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({ mutationFn: deleteDomain, onSuccess: invalidate });
}

export function useCreateBatch() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({
    mutationFn: (input: Partial<InternshipBatch>) => createBatch(input),
    onSuccess: invalidate,
  });
}

export function useUpdateBatch() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<InternshipBatch> }) =>
      updateBatch(id, input),
    onSuccess: invalidate,
  });
}

export function useCreateTask() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({
    mutationFn: (input: Partial<Task> & { batch_id: string }) => createTask(input),
    onSuccess: invalidate,
  });
}

export function useUpdateTask() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Task> }) =>
      updateTask(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteTask() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({ mutationFn: deleteTask, onSuccess: invalidate });
}

export function useReorderTasks() {
  const invalidate = useCatalogueInvalidator();
  return useMutation({
    mutationFn: ({ batchId, taskIds }: { batchId: string; taskIds: string[] }) =>
      reorderTasks(batchId, taskIds),
    onSuccess: invalidate,
  });
}

/* --- Ops ------------------------------------------------------------------- */

export function useCertificates() {
  return useQuery({
    queryKey: queryKeys.certificates.all,
    queryFn: listCertificates,
  });
}

export function useRevokeCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      revokeCertificate(id, reason),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all }),
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.overview,
    queryFn: getAnalyticsOverview,
  });
}

export function useActivityLogs(filters: { user_id?: string; module?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.logs.list(filters),
    queryFn: () => listActivityLogs(filters),
  });
}


/* --- Study notes ----------------------------------------------------------- */

export function useChapters(domainId?: string) {
  return useQuery({
    queryKey: queryKeys.chapters(domainId),
    queryFn: () => listChapters(domainId),
  });
}

function useChapterInvalidator() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["chapters"] });
}

export function useCreateChapter() {
  const invalidate = useChapterInvalidator();
  return useMutation({ mutationFn: createChapter, onSuccess: invalidate });
}

export function useUpdateChapter() {
  const invalidate = useChapterInvalidator();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
      updateChapter(id, body),
    onSuccess: invalidate,
  });
}

export function useDeleteChapter() {
  const invalidate = useChapterInvalidator();
  return useMutation({ mutationFn: deleteChapter, onSuccess: invalidate });
}

export function useUploadChapterPdf() {
  const invalidate = useChapterInvalidator();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadChapterPdf(id, file),
    onSuccess: invalidate,
  });
}
