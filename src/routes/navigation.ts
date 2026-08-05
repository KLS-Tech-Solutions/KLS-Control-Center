import {
  Award,
  BarChart3,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  UserCircle,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Optional count rendered as a pill on the right of the nav row. */
  badge?: number
}

export interface NavSection {
  heading: string
  items: NavItem[]
}

/**
 * Single source of truth for the sidebar. `routes/index.tsx` renders the same
 * paths, so adding a page means touching these two files and nothing else.
 */
export const navigation: NavSection[] = [
  {
    heading: 'Overview',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    heading: 'Operations',
    items: [
      { label: 'Students', to: '/students', icon: Users },
      { label: 'Internships', to: '/internships', icon: GraduationCap },
      { label: 'Certificates', to: '/certificates', icon: Award },
      { label: 'Payments', to: '/payments', icon: CreditCard },
      { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    ],
  },
  {
    heading: 'Workspace',
    items: [
      { label: 'Support', to: '/support', icon: LifeBuoy, badge: 4 },
      { label: 'Settings', to: '/settings', icon: Settings },
      { label: 'Profile', to: '/profile', icon: UserCircle },
    ],
  },
]

/** Flat lookup used by the Topbar breadcrumb. */
export const navLabelByPath = Object.fromEntries(
  navigation.flatMap((section) => section.items.map((item) => [item.to, item.label])),
) as Record<string, string>
