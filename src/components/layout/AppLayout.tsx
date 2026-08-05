import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

/**
 * Application shell: navy rail + sticky topbar + animated page area.
 * All authenticated-looking pages render through this layout's <Outlet />.
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { pathname } = useLocation()

  // Close the drawer on navigation and whenever we grow into the desktop rail.
  useEffect(() => setMobileOpen(false), [pathname])
  useEffect(() => {
    if (isDesktop) setMobileOpen(false)
  }, [isDesktop])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div className="bg-plane min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]',
        )}
      >
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} />

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
          {/* Page transition — keyed on pathname so each route fades/slides in */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
