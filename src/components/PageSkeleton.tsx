/**
 * Loading placeholder shown while a lazily-imported page chunk resolves.
 * Mirrors the common page rhythm (header → stat row → panel) so the layout
 * doesn't jump once the real content arrives.
 */
export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy role="status" aria-label="Loading page">
      <div className="space-y-2">
        <div className="bg-surface h-7 w-52 rounded-lg" />
        <div className="bg-surface h-4 w-80 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface border-hairline h-[124px] rounded-2xl border" />
        ))}
      </div>
      <div className="bg-surface border-hairline h-[320px] rounded-2xl border" />
    </div>
  )
}
