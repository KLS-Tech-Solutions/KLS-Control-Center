import type { BadgeTone } from '@/components/ui/Badge'

/**
 * Single source of truth for status → tone mapping.
 * Keeping it here means a new status value is a one-line change, not a hunt
 * through every table cell.
 */
const toneByStatus: Record<string, BadgeTone> = {
  // students
  active: 'success',
  completed: 'info',
  pending: 'warning',
  inactive: 'neutral',
  // internships
  open: 'info',
  ongoing: 'success',
  closed: 'neutral',
  // certificates
  issued: 'success',
  revoked: 'danger',
  // payments
  paid: 'success',
  failed: 'danger',
  refunded: 'neutral',
  // tickets
  'in-progress': 'info',
  resolved: 'success',
  // priorities
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
  // system services
  operational: 'success',
  degraded: 'warning',
  down: 'danger',
}

export const toneFor = (status: string): BadgeTone => toneByStatus[status] ?? 'neutral'

/** "in-progress" → "In progress" for human-facing labels. */
export const labelFor = (status: string) => status.replace(/-/g, ' ')
