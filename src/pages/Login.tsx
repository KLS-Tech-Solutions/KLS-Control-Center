import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'

const highlights = [
  'Unified view of students, cohorts and mentors',
  'Certificate issuance and payment reconciliation',
  'Operational analytics across all five tracks',
]

/**
 * Login screen — presentation only.
 *
 * There is no authentication in this prototype: submitting simply routes to
 * /dashboard so the team can walk the full UI.
 */
export function Login() {
  const navigate = useNavigate()
  const [remember, setRemember] = useState(true)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="bg-plane grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — hidden on small screens to keep the form above the fold */}
      <aside className="bg-navy-950 relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        {/* Ambient azure glow */}
        <div
          className="bg-azure-600/25 pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-[120px]"
          aria-hidden
        />
        <div
          className="bg-azure-500/15 pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full blur-[120px]"
          aria-hidden
        />

        <Logo />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md"
        >
          <h2 className="text-[34px] leading-[1.15] font-semibold tracking-tight text-white">
            Run every KLS programme from one control center.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {highlights.map((line, i) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
                className="text-navy-200 flex items-start gap-3 text-[14px]"
              >
                <ShieldCheck size={17} className="text-azure-400 mt-0.5 shrink-0" />
                {line}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="text-navy-400 relative text-[12px]">
          © 2026 KLS Tech Solutions · admin.klstechsolutions.in
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8 lg:hidden">
            <Logo tone="dark" />
          </div>

          <div className="glass border-hairline rounded-2xl border p-7 shadow-[var(--shadow-lift)] sm:p-8">
            <h1 className="text-[22px] font-semibold tracking-tight">Sign in</h1>
            <p className="text-secondary mt-1.5 text-sm">
              Use your KLS administrator account to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <Field label="Email address" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@klstechsolutions.in"
                  defaultValue="admin@klstechsolutions.in"
                  icon={<Mail size={16} />}
                />
              </Field>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-secondary text-[13px] font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-azure-600 text-[12.5px] font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  defaultValue="prototype"
                  icon={<Lock size={16} />}
                />
              </div>

              <div className="flex items-center gap-3">
                <Toggle checked={remember} onChange={setRemember} label="Keep me signed in" />
                <span className="text-secondary text-[13px]">Keep me signed in</span>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Sign in to dashboard
                <ArrowRight size={16} />
              </Button>
            </form>

            <p className="text-muted mt-6 text-center text-[12px] leading-relaxed">
              UI prototype — no authentication is performed. Any credentials continue to the
              dashboard.
            </p>
          </div>

          <p className="text-muted mt-6 text-center text-[12px] lg:hidden">
            © 2026 KLS Tech Solutions
          </p>
        </motion.div>
      </main>
    </div>
  )
}
