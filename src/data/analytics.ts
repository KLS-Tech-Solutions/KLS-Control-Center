import type { ActivityItem, SeriesPoint, SystemService } from '@/types'

/**
 * Aggregated metrics powering the Dashboard and Analytics pages.
 * Replace with `GET /api/analytics/*` during backend integration.
 */

/** Cumulative student base, month by month. */
export const studentGrowth: SeriesPoint[] = [
  { month: 'Sep', students: 412 },
  { month: 'Oct', students: 486 },
  { month: 'Nov', students: 559 },
  { month: 'Dec', students: 601 },
  { month: 'Jan', students: 704 },
  { month: 'Feb', students: 812 },
  { month: 'Mar', students: 918 },
  { month: 'Apr', students: 1011 },
  { month: 'May', students: 1128 },
  { month: 'Jun', students: 1242 },
  { month: 'Jul', students: 1379 },
  { month: 'Aug', students: 1486 },
]

/** New registrations per month, split by acquisition channel. */
export const monthlyRegistrations: SeriesPoint[] = [
  { month: 'Sep', organic: 38, referral: 22, campaign: 14 },
  { month: 'Oct', organic: 44, referral: 19, campaign: 11 },
  { month: 'Nov', organic: 41, referral: 21, campaign: 11 },
  { month: 'Dec', organic: 26, referral: 10, campaign: 6 },
  { month: 'Jan', organic: 58, referral: 27, campaign: 18 },
  { month: 'Feb', organic: 61, referral: 29, campaign: 18 },
  { month: 'Mar', organic: 59, referral: 26, campaign: 21 },
  { month: 'Apr', organic: 51, referral: 24, campaign: 18 },
  { month: 'May', organic: 63, referral: 31, campaign: 23 },
  { month: 'Jun', organic: 60, referral: 29, campaign: 25 },
  { month: 'Jul', organic: 72, referral: 35, campaign: 30 },
  { month: 'Aug', organic: 56, referral: 28, campaign: 23 },
]

/** Certificates issued vs. still pending review. */
export const certificateTrend: SeriesPoint[] = [
  { month: 'Sep', issued: 28, pending: 9 },
  { month: 'Oct', issued: 34, pending: 7 },
  { month: 'Nov', issued: 31, pending: 12 },
  { month: 'Dec', issued: 19, pending: 6 },
  { month: 'Jan', issued: 46, pending: 11 },
  { month: 'Feb', issued: 52, pending: 14 },
  { month: 'Mar', issued: 48, pending: 10 },
  { month: 'Apr', issued: 41, pending: 13 },
  { month: 'May', issued: 57, pending: 15 },
  { month: 'Jun', issued: 54, pending: 12 },
  { month: 'Jul', issued: 66, pending: 18 },
  { month: 'Aug', issued: 44, pending: 21 },
]

/** Collected revenue in ₹. */
export const revenueTrend: SeriesPoint[] = [
  { month: 'Sep', revenue: 862000 },
  { month: 'Oct', revenue: 941000 },
  { month: 'Nov', revenue: 903000 },
  { month: 'Dec', revenue: 574000 },
  { month: 'Jan', revenue: 1268000 },
  { month: 'Feb', revenue: 1394000 },
  { month: 'Mar', revenue: 1341000 },
  { month: 'Apr', revenue: 1187000 },
  { month: 'May', revenue: 1462000 },
  { month: 'Jun', revenue: 1408000 },
  { month: 'Jul', revenue: 1721000 },
  { month: 'Aug', revenue: 1284000 },
]

/** Share of enrolments by programme — used for the Analytics donut. */
export const programMix = [
  { name: 'Full Stack', value: 126 },
  { name: 'Artificial Intelligence', value: 97 },
  { name: 'Python', value: 84 },
  { name: 'Cyber Security', value: 58 },
]

/** Completion rate per programme — used for the Analytics horizontal bars. */
export const completionRates = [
  { program: 'Python', rate: 88 },
  { program: 'Full Stack', rate: 74 },
  { program: 'Cyber Security', rate: 69 },
  { program: 'Artificial Intelligence', rate: 63 },
  { program: 'Agentic AI', rate: 57 },
]

export const recentActivity: ActivityItem[] = [
  { id: 'act-01', actor: 'Ananya Pillai', action: 'enrolled in', target: 'Agentic AI', timestamp: '4 minutes ago', type: 'student' },
  { id: 'act-02', actor: 'System', action: 'issued certificate', target: 'KLS-2026-FS-0211', timestamp: '22 minutes ago', type: 'certificate' },
  { id: 'act-03', actor: 'Manish Patel', action: 'completed payment', target: 'INV-2026-1053', timestamp: '1 hour ago', type: 'payment' },
  { id: 'act-04', actor: 'Tanvi Desai', action: 'raised ticket', target: 'KLS-T-4822', timestamp: '3 hours ago', type: 'support' },
  { id: 'act-05', actor: 'System', action: 'completed nightly backup', target: 'kls-primary-db', timestamp: '9 hours ago', type: 'system' },
  { id: 'act-06', actor: 'Shreya Kapoor', action: 'payment failed for', target: 'INV-2026-1052', timestamp: '11 hours ago', type: 'payment' },
]

export const systemStatus: SystemService[] = [
  { name: 'Web Portal', status: 'operational', uptime: '99.98%', latency: '128 ms' },
  { name: 'Payment Gateway', status: 'operational', uptime: '99.94%', latency: '241 ms' },
  { name: 'Certificate Service', status: 'degraded', uptime: '99.12%', latency: '812 ms' },
  { name: 'Email / SMTP', status: 'operational', uptime: '99.99%', latency: '96 ms' },
]

/** Headline KPI values for the Dashboard stat row. */
export const dashboardStats = {
  totalStudents: 1486,
  activeInternships: 5,
  certificatesIssued: 520,
  revenue: 14345000,
  pendingPayments: 83997,
  supportTickets: 10,
}
