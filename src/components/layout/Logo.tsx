import { cn } from '@/utils/cn'

/**
 * KLS wordmark. The glyph is inline SVG so the shell renders with zero asset
 * requests and works identically on light and navy surfaces.
 */
export function Logo({
  compact = false,
  tone = 'light',
  className,
}: {
  /** Mark only, no wordmark — used by the collapsed rail. */
  compact?: boolean
  /** `light` = white text (navy surface). `dark` = navy text (white surface). */
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="from-azure-500 to-azure-700 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br shadow-[0_2px_8px_rgba(30,136,229,0.35)]">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 4v16M5 12l8-8M5 12l8 8M17.5 4.5v15"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span
            className={cn(
              'block text-[14px] font-semibold tracking-tight',
              tone === 'light' ? 'text-white' : 'text-navy-900 dark:text-white',
            )}
          >
            KLS Control Center
          </span>
          <span
            className={cn(
              'block text-[10.5px] tracking-[0.1em] uppercase',
              tone === 'light' ? 'text-navy-300' : 'text-muted',
            )}
          >
            Tech Solutions
          </span>
        </span>
      )}
    </div>
  )
}
