import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserCircle,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { adminProfile, notifications } from '@/data/admin'
import { useTheme } from '@/hooks/useTheme'
import { navLabelByPath } from '@/routes/navigation'
import { cn } from '@/utils/cn'
import { titleCase } from '@/utils/format'

/** Close a popover when the user clicks anywhere outside it. */
function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOutside])
  return ref
}

const popover =
  'bg-surface border-hairline absolute right-0 top-[calc(100%+10px)] z-50 rounded-xl border shadow-[var(--shadow-lift)]'

function Breadcrumb() {
  const { pathname } = useLocation()
  const current = navLabelByPath[pathname] ?? titleCase(pathname.replace('/', '')) ?? 'Dashboard'

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-[13px] md:flex">
      <Link to="/dashboard" className="text-muted hover:text-azure-600 transition-colors">
        KLS
      </Link>
      <ChevronRight size={13} className="text-muted" aria-hidden />
      <span className="font-medium">{current}</span>
    </nav>
  )
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
  const unread = notifications.filter((n) => n.unread).length

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications, ${unread} unread`}
        className="hover:bg-surface-muted relative grid h-9 w-9 place-items-center rounded-lg transition-colors"
      >
        <Bell size={18} className="text-secondary" />
        {unread > 0 && (
          <span className="bg-azure-600 ring-surface absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white ring-2">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(popover, 'w-[min(340px,calc(100vw-2rem))]')}
          >
            <div className="border-hairline flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              <button className="text-azure-600 text-[12px] font-medium hover:underline">
                Mark all read
              </button>
            </div>
            <ul className="max-h-[320px] overflow-y-auto">
              {notifications.map((item) => (
                <li
                  key={item.id}
                  className="border-hairline hover:bg-surface-muted flex gap-3 border-b px-4 py-3 last:border-0"
                >
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      item.unread ? 'bg-azure-600' : 'bg-mist-300 dark:bg-white/20',
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{item.title}</p>
                    <p className="text-muted mt-0.5 text-[12px] leading-relaxed">{item.body}</p>
                    <p className="text-muted mt-1 text-[11px]">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
  const navigate = useNavigate()

  const go = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-surface-muted flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors"
        aria-label="Account menu"
      >
        <Avatar name={adminProfile.name} />
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[13px] font-medium">{adminProfile.name}</span>
          <span className="text-muted block text-[11px]">{adminProfile.role}</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(popover, 'w-[224px] p-1.5')}
          >
            <div className="border-hairline mb-1.5 border-b px-3 pt-2 pb-3">
              <p className="text-[13px] font-semibold">{adminProfile.name}</p>
              <p className="text-muted truncate text-[12px]">{adminProfile.email}</p>
            </div>
            <button
              onClick={() => go('/profile')}
              className="text-secondary hover:bg-surface-muted flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px]"
            >
              <UserCircle size={16} /> Profile
            </button>
            <button
              onClick={() => go('/settings')}
              className="text-secondary hover:bg-surface-muted flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px]"
            >
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={() => go('/')}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/25"
            >
              <LogOut size={16} /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Sticky application header: mobile nav trigger, breadcrumb, global search,
 * theme placeholder, notifications and the account menu.
 */
export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="glass border-hairline sticky top-0 z-20 border-b">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="hover:bg-surface-muted grid h-9 w-9 place-items-center rounded-lg lg:hidden"
        >
          <Menu size={19} className="text-secondary" />
        </button>

        <Breadcrumb />

        {/* Search grows to fill the middle of the bar */}
        <div className="ml-auto max-w-md flex-1 md:ml-6">
          <div className="relative">
            <Search
              size={16}
              className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="search"
              placeholder="Search students, invoices, tickets…"
              aria-label="Search"
              className="bg-surface border-hairline focus:border-azure-600 h-9 w-full rounded-lg border pr-3 pl-9 text-[13px] transition-colors placeholder:text-[color:var(--ink-muted)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="hover:bg-surface-muted grid h-9 w-9 place-items-center rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-secondary" />
            ) : (
              <Moon size={18} className="text-secondary" />
            )}
          </button>
          <NotificationsMenu />
          <div className="bg-[color:var(--hairline)] mx-1 hidden h-6 w-px sm:block" />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
