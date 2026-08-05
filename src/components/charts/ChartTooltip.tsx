/**
 * Shared tooltip surface for every chart in the app.
 *
 * Every chart ships with hover by default — with several light-mode series
 * sitting below 3:1 against the white card, the tooltip is the relief that
 * keeps values readable without leaning on colour.
 */

/** Minimal shape of what Recharts injects into a custom `content` element. */
interface TooltipEntry {
  dataKey?: string | number
  name?: string | number
  value?: number
  color?: string
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  /** Optional value formatter, e.g. currency. */
  formatter?: (value: number) => string
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-surface border-hairline min-w-[150px] rounded-xl border px-3 py-2.5 shadow-[var(--shadow-lift)]">
      <p className="text-muted mb-2 text-[11px] font-semibold tracking-[0.06em] uppercase">
        {label}
      </p>
      <ul className="space-y-1.5">
        {payload.map((entry) => {
          const value = Number(entry.value ?? 0)
          return (
            <li key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-[13px] capitalize">
                <span
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden
                />
                <span className="text-secondary">{entry.name}</span>
              </span>
              <span className="tabular text-[13px] font-semibold">
                {formatter ? formatter(value) : value.toLocaleString('en-IN')}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Legend row rendered outside the SVG so identity is never colour-only. */
export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="text-secondary flex items-center gap-2 text-[12px]">
          <span
            className="h-2 w-2 rounded-[2px]"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
