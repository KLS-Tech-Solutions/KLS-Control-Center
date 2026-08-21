/**
 * Every cache key in one registry, so invalidating after a review is a lookup
 * rather than a guess. Keys are hierarchical — invalidating
 * `queryKeys.reviews.all` clears both queues and every detail beneath them.
 */
export const queryKeys = {
  session: ["session"] as const,

  reviews: {
    all: ["reviews"] as const,
    linkedin: (status?: string) => ["reviews", "linkedin", status ?? "all"] as const,
    linkedinDetail: (id: string) => ["reviews", "linkedin", "detail", id] as const,
    tasks: (filters?: Record<string, string | undefined>) =>
      ["reviews", "tasks", filters ?? {}] as const,
    taskDetail: (id: string) => ["reviews", "tasks", "detail", id] as const,
  },

  students: {
    all: ["students"] as const,
    list: (filters?: Record<string, string | undefined>) =>
      ["students", "list", filters ?? {}] as const,
    detail: (id: string) => ["students", "detail", id] as const,
  },

  catalogue: {
    all: ["catalogue"] as const,
    domains: ["catalogue", "domains"] as const,
    batches: (domainId?: string) => ["catalogue", "batches", domainId ?? "all"] as const,
    tasks: (batchId: string) => ["catalogue", "tasks", batchId] as const,
  },

  chapters: (domainId?: string) => ["chapters", domainId ?? "all"] as const,

  certificates: {
    all: ["certificates"] as const,
  },

  analytics: {
    overview: ["analytics", "overview"] as const,
  },

  admins: {
    all: ["admins"] as const,
  },

  logs: {
    all: ["logs"] as const,
    list: (filters?: Record<string, string | undefined>) =>
      ["logs", filters ?? {}] as const,
  },
} as const;
