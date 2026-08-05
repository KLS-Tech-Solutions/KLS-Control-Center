import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsLeft, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigation } from '@/routes/navigation'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/layout/Logo'

interface SidebarProps {
  /** Desktop rail collapsed to icons only. */
  collapsed: boolean
  onToggleCollapse: () => void
  /** Mobile drawer visibility. */
  mobileOpen: boolean
  onCloseMobile: () => void
}

function NavRows({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {navigation.map((section) => (
        <div key={section.heading}>
          {!collapsed && (
            <p className="text-navy-300 mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] uppercase">
              {section.heading}
            </p>
          )}
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-navy-200 hover:bg-white/6 hover:text-white',
                      collapsed && 'justify-center px-0',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active marker — a shape cue, not just a colour change */}
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="bg-azure-500 absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <item.icon size={18} strokeWidth={2} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge !== undefined && (
                        <span className="bg-azure-600 ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return null
  return (
    <div className="px-3 pb-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-[12px] font-semibold text-white">Prototype build</p>
        <p className="text-navy-300 mt-1 text-[11px] leading-relaxed">
          UI reference only — mock data, no backend connected.
        </p>
      </div>
    </div>
  )
}

/**
 * Navy navigation rail. Collapses to icons on desktop and becomes an overlay
 * drawer below the `lg` breakpoint.
 */
export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop rail */}
      <aside
        className={cn(
          'bg-navy-950 fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-white/8 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex',
          collapsed ? 'w-[76px]' : 'w-[260px]',
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b border-white/8 px-4',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          <Logo compact={collapsed} />
          {!collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="text-navy-300 rounded-md p-1.5 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronsLeft size={16} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="text-navy-300 mx-auto mt-3 rounded-md p-1.5 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronsLeft size={16} className="rotate-180" />
          </button>
        )}

        <NavRows collapsed={collapsed} />
        <SidebarFooter collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="bg-navy-950/50 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="bg-navy-950 fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/8 px-4">
                <Logo />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close navigation"
                  className="text-navy-300 rounded-md p-1.5 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <NavRows collapsed={false} onNavigate={onCloseMobile} />
              <SidebarFooter collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
