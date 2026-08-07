"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  getTaskSubmission,
  listLinkedInSubmissions,
  listTaskSubmissions,
  reviewLinkedInSubmission,
  reviewTaskSubmission,
  type TaskSubmissionFilters,
} from "@/services/reviews.service";
import type { ReviewStatus } from "@/types";

export function useLinkedInQueue(status?: ReviewStatus) {
  return useQuery({
    queryKey: queryKeys.reviews.linkedin(status),
    queryFn: () => listLinkedInSubmissions(status),
  });
}

export function useTaskQueue(filters: TaskSubmissionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.reviews.tasks(filters as Record<string, string | undefined>),
    queryFn: () => listTaskSubmissions(filters),
  });
}

export function useTaskSubmission(id: string) {
  return useQuery({
    queryKey: queryKeys.reviews.taskDetail(id),
    queryFn: () => getTaskSubmission(id),
    enabled: Boolean(id),
  });
}

/**
 * A review changes the student's stage, so everything that reads a queue,
 * a student record or the pending counters is invalidated together.
 */
function useReviewInvalidator() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.overview });
  };
}

export function useReviewTask() {
  const invalidate = useReviewInvalidator();
  return useMutation({
    mutationFn: ({
      id,
      status,
      remarks,
    }: {
      id: string;
      status: "approved" | "rejected";
      remarks: string;
    }) => reviewTaskSubmission(id, { status, remarks }),
    onSuccess: invalidate,
  });
}

export function useReviewLinkedIn() {
  const invalidate = useReviewInvalidator();
  return useMutation({
    mutationFn: ({
      id,
      status,
      remarks,
    }: {
      id: string;
      status: "approved" | "rejected";
      remarks: string;
    }) => reviewLinkedInSubmission(id, { status, remarks }),
    onSuccess: invalidate,
  });
}
