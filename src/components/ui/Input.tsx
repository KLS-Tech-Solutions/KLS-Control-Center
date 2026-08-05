import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

const fieldBase =
  'w-full rounded-lg border border-hairline bg-surface px-3 text-sm text-[color:var(--ink-primary)] transition-colors placeholder:text-[color:var(--ink-muted)] hover:border-mist-300 focus:border-azure-600 focus:outline-none disabled:opacity-60 dark:hover:border-white/20'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading adornment (usually a Lucide icon). */
  icon?: ReactNode
}

export function Input({ className, icon, ...props }: InputProps) {
  if (!icon) return <input className={cn(fieldBase, 'h-10', className)} {...props} />

  return (
    <div className="relative">
      <span className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
        {icon}
      </span>
      <input className={cn(fieldBase, 'h-10 pl-9', className)} {...props} />
    </div>
  )
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, 'h-10 cursor-pointer pr-8', className)} {...props}>
      {children}
    </select>
  )
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-secondary mb-1.5 block text-[13px] font-medium">
      {children}
    </label>
  )
}

/** Label + field pairing used across Settings and Profile forms. */
export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-muted mt-1.5 text-xs">{hint}</p>}
    </div>
  )
}
