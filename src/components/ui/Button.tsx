import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-azure-600 text-white shadow-[0_1px_2px_rgba(6,18,37,0.16)] hover:bg-azure-700',
        navy: 'bg-navy-900 text-white hover:bg-navy-800 dark:bg-white dark:text-navy-950 dark:hover:bg-mist-200',
        outline:
          'border border-hairline bg-surface text-[color:var(--ink-primary)] hover:bg-surface-muted',
        ghost: 'text-secondary hover:bg-surface-muted hover:text-[color:var(--ink-primary)]',
        subtle: 'bg-azure-50 text-azure-700 hover:bg-azure-100 dark:bg-azure-900/30 dark:text-azure-300 dark:hover:bg-azure-900/50',
        danger: 'bg-[color:var(--color-status-critical)] text-white hover:brightness-95',
      },
      size: {
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-sm',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
