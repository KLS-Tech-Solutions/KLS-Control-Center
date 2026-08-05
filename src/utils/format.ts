/** Shared display formatters. Kept UI-only — no locale switching in the prototype. */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const compact = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 })

export const formatCurrency = (value: number) => inr.format(value)

/** ₹12.4L style short form for stat tiles and axis ticks. */
export const formatCurrencyCompact = (value: number) => `₹${compact.format(value)}`

export const formatNumber = (value: number) => new Intl.NumberFormat('en-IN').format(value)

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

/** Turn "/students" into "Students" for breadcrumbs and page titles. */
export const titleCase = (segment: string) =>
  segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
