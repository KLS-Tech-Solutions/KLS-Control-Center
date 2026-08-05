import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Titled panel used for every chart and list block on the Dashboard and
 * Analytics pages. Keeps header rhythm and entrance animation in one place.
 */
export function DashboardCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  index = 0,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  index?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'bg-surface border-hairline rounded-2xl border shadow-[var(--shadow-soft)]',
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-6">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          {description && <p className="text-muted mt-1 text-[13px]">{description}</p>}
        </div>
        {action}
      </header>
      <div className={cn('px-5 pb-5 sm:px-6 sm:pb-6', bodyClassName)}>{children}</div>
    </motion.section>
  )
}
