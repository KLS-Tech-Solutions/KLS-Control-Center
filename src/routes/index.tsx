import { Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageSkeleton } from '@/components/PageSkeleton'
import { Login } from '@/pages/Login'

/*
  Pages are code-split so the chart-heavy routes (Analytics, Dashboard,
  Payments) don't sit in the entry bundle. Login stays eager — it is the first
  paint of the app.
*/
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Students = lazy(() => import('@/pages/Students').then((m) => ({ default: m.Students })))
const Internships = lazy(() =>
  import('@/pages/Internships').then((m) => ({ default: m.Internships })),
)
const Certificates = lazy(() =>
  import('@/pages/Certificates').then((m) => ({ default: m.Certificates })),
)
const Payments = lazy(() => import('@/pages/Payments').then((m) => ({ default: m.Payments })))
const Analytics = lazy(() => import('@/pages/Analytics').then((m) => ({ default: m.Analytics })))
const Support = lazy(() => import('@/pages/Support').then((m) => ({ default: m.Support })))
const SettingsPage = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })))
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageSkeleton />}>{element}</Suspense>
)

/**
 * Route table.
 *
 * `/` is the login screen and sits outside the shell; every other route renders
 * inside <AppLayout />. There is no route guard — the prototype has no auth.
 */
export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: withSuspense(<Dashboard />) },
      { path: '/students', element: withSuspense(<Students />) },
      { path: '/internships', element: withSuspense(<Internships />) },
      { path: '/certificates', element: withSuspense(<Certificates />) },
      { path: '/payments', element: withSuspense(<Payments />) },
      { path: '/analytics', element: withSuspense(<Analytics />) },
      { path: '/support', element: withSuspense(<Support />) },
      { path: '/settings', element: withSuspense(<SettingsPage />) },
      { path: '/profile', element: withSuspense(<Profile />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
])
