import { Building2, CreditCard, Mail, Palette, Shield } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Field, Input, Select } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

const tabs = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'smtp', label: 'SMTP', icon: Mail },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'theme', label: 'Theme', icon: Palette },
] as const

type TabId = (typeof tabs)[number]['id']

/** Row wrapper for a labelled switch inside a settings panel. */
function ToggleRow({
  title,
  description,
  defaultOn = false,
}: {
  title: string
  description: string
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="border-hairline flex items-start justify-between gap-4 border-b py-4 last:border-0">
      <div>
        <p className="text-[13.5px] font-medium">{title}</p>
        <p className="text-muted mt-0.5 text-[12.5px] leading-relaxed">{description}</p>
      </div>
      <Toggle checked={on} onChange={setOn} label={title} />
    </div>
  )
}

function CompanyPanel() {
  return (
    <>
      <CardHeader>
        <div>
          <CardTitle>Company profile</CardTitle>
          <CardDescription>Details shown on certificates, invoices and emails.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Legal name">
          <Input defaultValue="KLS Tech Solutions Pvt. Ltd." />
        </Field>
        <Field label="Display name">
          <Input defaultValue="KLS Tech Solutions" />
        </Field>
        <Field label="Support email">
          <Input type="email" defaultValue="support@klstechsolutions.in" />
        </Field>
        <Field label="Contact number">
          <Input defaultValue="+91 98860 40021" />
        </Field>
        <Field label="GSTIN">
          <Input defaultValue="29ABCDE1234F1Z5" />
        </Field>
        <Field label="Portal domain" hint="Used in outbound links and certificate QR codes.">
          <Input defaultValue="admin.klstechsolutions.in" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Registered address">
            <Input defaultValue="4th Floor, Tech Park, Whitefield, Bengaluru 560066" />
          </Field>
        </div>
      </CardContent>
    </>
  )
}

function SmtpPanel() {
  return (
    <>
      <CardHeader>
        <div>
          <CardTitle>SMTP configuration</CardTitle>
          <CardDescription>Outbound mail used for enrolment and certificate notices.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="SMTP host">
          <Input defaultValue="smtp.klstechsolutions.in" />
        </Field>
        <Field label="Port">
          <Input defaultValue="587" />
        </Field>
        <Field label="Username">
          <Input defaultValue="no-reply@klstechsolutions.in" />
        </Field>
        <Field label="Password">
          <Input type="password" defaultValue="••••••••••••" />
        </Field>
        <Field label="Encryption">
          <Select defaultValue="starttls">
            <option value="starttls">STARTTLS</option>
            <option value="ssl">SSL / TLS</option>
            <option value="none">None</option>
          </Select>
        </Field>
        <Field label="From name">
          <Input defaultValue="KLS Tech Solutions" />
        </Field>
        <div className="sm:col-span-2">
          <ToggleRow
            title="Send delivery receipts"
            description="Request a read receipt for certificate issuance emails."
          />
        </div>
      </CardContent>
    </>
  )
}

function PaymentsPanel() {
  return (
    <>
      <CardHeader>
        <div>
          <CardTitle>Payment settings</CardTitle>
          <CardDescription>Gateway, currency and invoicing preferences.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Primary gateway">
          <Select defaultValue="razorpay">
            <option value="razorpay">Razorpay</option>
            <option value="payu">PayU</option>
            <option value="stripe">Stripe</option>
          </Select>
        </Field>
        <Field label="Currency">
          <Select defaultValue="inr">
            <option value="inr">INR — Indian Rupee</option>
            <option value="usd">USD — US Dollar</option>
          </Select>
        </Field>
        <Field label="Invoice prefix">
          <Input defaultValue="INV-2026-" />
        </Field>
        <Field label="Payment due window" hint="Days before an invoice is marked overdue.">
          <Input defaultValue="7" />
        </Field>
        <div className="sm:col-span-2">
          <ToggleRow
            title="Auto-retry failed payments"
            description="Retry declined cards once after 24 hours."
            defaultOn
          />
          <ToggleRow
            title="Allow partial payments"
            description="Let students pay programme fees in instalments."
          />
        </div>
      </CardContent>
    </>
  )
}

function SecurityPanel() {
  return (
    <>
      <CardHeader>
        <div>
          <CardTitle>Security</CardTitle>
          <CardDescription>Access policy for administrator accounts.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ToggleRow
          title="Two-factor authentication"
          description="Require a TOTP code for every administrator sign-in."
          defaultOn
        />
        <ToggleRow
          title="Single sign-on (SSO)"
          description="Delegate authentication to the KLS Google Workspace tenant."
        />
        <ToggleRow
          title="IP allow-list"
          description="Restrict portal access to the office and VPN ranges."
        />
        <ToggleRow
          title="Audit logging"
          description="Record every write action with actor, timestamp and payload."
          defaultOn
        />
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Session timeout">
            <Select defaultValue="60">
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="480">8 hours</option>
            </Select>
          </Field>
          <Field label="Password rotation">
            <Select defaultValue="90">
              <option value="60">Every 60 days</option>
              <option value="90">Every 90 days</option>
              <option value="never">Never</option>
            </Select>
          </Field>
        </div>
      </CardContent>
    </>
  )
}

function ThemePanel() {
  const { theme, setTheme } = useTheme()
  const options = [
    { id: 'light', label: 'Light', preview: 'bg-white border-mist-200' },
    { id: 'dark', label: 'Dark', preview: 'bg-navy-950 border-navy-800' },
  ] as const

  return (
    <>
      <CardHeader>
        <div>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Appearance of the control center for your account.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:max-w-md">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setTheme(option.id)}
              className={cn(
                'rounded-xl border p-3 text-left transition-all duration-200',
                theme === option.id
                  ? 'border-azure-600 ring-azure-600/25 ring-2'
                  : 'border-hairline hover:border-mist-300',
              )}
            >
              <span className={cn('block h-16 w-full rounded-lg border', option.preview)} />
              <span className="mt-2.5 block text-[13px] font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <ToggleRow
            title="Compact density"
            description="Reduce padding in tables and cards for denser screens."
          />
          <ToggleRow
            title="Reduce motion"
            description="Minimise page and card animations across the portal."
          />
        </div>
      </CardContent>
    </>
  )
}

const panels: Record<TabId, () => React.JSX.Element> = {
  company: CompanyPanel,
  smtp: SmtpPanel,
  payments: PaymentsPanel,
  security: SecurityPanel,
  theme: ThemePanel,
}

export function Settings() {
  const [active, setActive] = useState<TabId>('company')
  const Panel = panels[active]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Portal configuration. Controls are presentational in this prototype."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        {/* Section nav — horizontal scroller on mobile, vertical list on desktop */}
        <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium transition-colors',
                active === tab.id
                  ? 'bg-azure-50 text-azure-700 dark:bg-azure-900/35 dark:text-azure-300'
                  : 'text-secondary hover:bg-surface-muted',
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <Card>
          <Panel />
          <CardFooter className="justify-end">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Save changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
