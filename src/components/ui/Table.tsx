import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

/**
 * Table primitives. The wrapper owns horizontal scrolling so wide tables never
 * push the page itself sideways on mobile.
 */
export function TableWrap({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />
}

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn('w-full min-w-[720px] border-collapse text-sm', className)} {...props} />
  )
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-surface-muted', className)} {...props} />
}

export function TH({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'text-muted border-hairline border-b px-5 py-3 text-left text-[11px] font-semibold tracking-[0.08em] uppercase whitespace-nowrap',
        className,
      )}
      {...props}
    />
  )
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-hairline hover:bg-surface-muted border-b transition-colors last:border-0',
        className,
      )}
      {...props}
    />
  )
}

export function TD({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-5 py-3.5 align-middle', className)} {...props} />
}

/** Centered message shown when a filter clears every row. */
export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="text-muted px-6 py-16 text-center text-sm">{children}</div>
}
