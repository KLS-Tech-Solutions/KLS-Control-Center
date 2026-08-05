import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-mist-100 text-[color:var(--ink-secondary)] dark:bg-white/8 dark:text-[color:var(--ink-secondary)]',
  info: 'bg-azure-50 text-azure-700 dark:bg-azure-900/35 dark:text-azure-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  danger: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
}

const dots: Record<BadgeTone, string> = {
  neutral: 'bg-mist-400',
  info: 'bg-azure-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
}

/**
 * Status pill. The dot is a deliberate second channel so state never rests on
 * colour alone — the label always carries the meaning too.
 */
export function Badge({
  tone = 'neutral',
  children,
  withDot = true,
  className,
}: {
  tone?: BadgeTone
  children: ReactNode
  withDot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] leading-none font-medium capitalize',
        tones[tone],
        className,
      )}
    >
      {withDot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} aria-hidden />}
      {children}
    </span>
  )
}
