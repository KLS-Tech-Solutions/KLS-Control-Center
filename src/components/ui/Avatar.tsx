import { initials } from '@/utils/format'
import { cn } from '@/utils/cn'

const sizes = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-20 w-20 text-lg',
}

/**
 * Initial-based avatar — no remote images, so nothing in the prototype makes a
 * network request.
 */
export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'from-azure-600 to-navy-800 inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white select-none',
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
