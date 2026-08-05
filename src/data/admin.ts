/** Signed-in admin and topbar notifications — presentational mock data only. */

export const adminProfile = {
  name: 'Bhaskar Kulkarni',
  role: 'Super Administrator',
  email: 'bhaskar@klstechsolutions.in',
  phone: '+91 98860 40021',
  location: 'Bengaluru, Karnataka',
  department: 'Operations & Delivery',
  joinedDate: '2023-04-17',
  timezone: 'Asia/Kolkata (IST)',
  lastLogin: '5 Aug 2026, 09:14 IST',
}

export const notifications = [
  {
    id: 'n1',
    title: 'Payment failed',
    body: 'Card payment for INV-2026-1052 was declined.',
    time: '12m ago',
    type: 'payment' as const,
    unread: true,
  },
  {
    id: 'n2',
    title: 'Certificate service degraded',
    body: 'Issuance latency is above the 500 ms threshold.',
    time: '48m ago',
    type: 'system' as const,
    unread: true,
  },
  {
    id: 'n3',
    title: '3 certificates awaiting approval',
    body: 'Full Stack and Cyber Security cohorts.',
    time: '2h ago',
    type: 'certificate' as const,
    unread: true,
  },
  {
    id: 'n4',
    title: 'New urgent ticket',
    body: 'KLS-T-4822 — UPI payment not reflected.',
    time: '5h ago',
    type: 'support' as const,
    unread: false,
  },
]

/** Recent admin sessions, shown on the Profile page. */
export const loginSessions = [
  { id: 's1', device: 'Chrome · Windows 11', location: 'Bengaluru, IN', time: '5 Aug 2026, 09:14', current: true },
  { id: 's2', device: 'Safari · iPhone 15', location: 'Bengaluru, IN', time: '4 Aug 2026, 21:02', current: false },
  { id: 's3', device: 'Edge · Windows 11', location: 'Hyderabad, IN', time: '2 Aug 2026, 11:47', current: false },
]
