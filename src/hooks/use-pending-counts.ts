"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { getAnalyticsOverview } from "@/services/ops.service";

/**
 * Review backlog, shown in the sidebar and top bar. Refreshed on an interval
 * because reviewers leave the console open — a queue that silently stops
 * updating is how submissions get forgotten.
 */
export function usePendingCounts() {
  const { data } = useQuery({
    queryKey: queryKeys.analytics.overview,
    queryFn: getAnalyticsOverview,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const tasks = data?.pending_task_reviews ?? 0;
  const linkedin = data?.pending_linkedin_reviews ?? 0;

  return { tasks, linkedin, total: tasks + linkedin };
}
