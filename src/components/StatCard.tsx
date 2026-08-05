import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Signed percentage change vs. the previous period, e.g. +12.4 */
  delta?: number
  caption?: string
  /** Index in the grid — drives the stagger on mount. */
  index?: number
  accent?: 'azure' | 'navy' | 'emerald' | 'amber' | 'rose' | 'violet'
}

const accents: Record<NonNullable<StatCardProps['accent']>, string> = {
  azure: 'bg-azure-50 text-azure-700 dark:bg-azure-900/35 dark:text-azure-300',
  navy: 'bg-navy-50 text-navy-700 dark:bg-white/8 dark:text-navy-100',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
}

/**
 * Headline KPI tile. No plot inside — the number is the message, so the delta
 * carries an arrow as well as a colour (never colour alone).
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  caption,
  index = 0,
  accent = 'azure',
}: StatCardProps) {
  const isUp = (delta ?? 0) >= 0
  const DeltaIcon = isUp ? ArrowUpRight : ArrowDownRight

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="bg-surface border-hairline rounded-2xl border p-5 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted text-[12px] font-medium tracking-[0.06em] uppercase">{label}</p>
        <span className={cn('grid h-9 w-9 place-items-center rounded-xl', accents[accent])}>
          <Icon size={17} strokeWidth={2} />
        </span>
      </div>

      <p className="tabular mt-4 text-[28px] leading-none font-semibold tracking-tight">{value}</p>

      <div className="mt-3 flex items-center gap-2">
        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[13px] font-medium',
              isUp
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-rose-700 dark:text-rose-400',
            )}
          >
            <DeltaIcon size={14} strokeWidth={2.5} />
            {Math.abs(delta)}%
          </span>
        )}
        {caption && <span className="text-muted text-[13px]">{caption}</span>}
      </div>
    </motion.div>
  )
}
