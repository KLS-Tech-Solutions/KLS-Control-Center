import {
  Building2,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Monitor,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Input'
import { adminProfile, loginSessions } from '@/data/admin'
import { formatDate } from '@/utils/format'

const details = [
  { icon: Mail, label: 'Email', value: adminProfile.email },
  { icon: Phone, label: 'Phone', value: adminProfile.phone },
  { icon: Building2, label: 'Department', value: adminProfile.department },
  { icon: MapPin, label: 'Location', value: adminProfile.location },
  { icon: CalendarDays, label: 'Joined', value: formatDate(adminProfile.joinedDate) },
  { icon: Clock, label: 'Timezone', value: adminProfile.timezone },
]

const permissions = [
  'Full student and cohort management',
  'Certificate issuance and revocation',
  'Payment reconciliation and refunds',
  'Portal configuration and user roles',
]

export function Profile() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your administrator account and recent activity."
        actions={<Button size="sm">Edit profile</Button>}
      />

      {/* Identity banner */}
      <Card className="overflow-hidden">
        <div className="from-navy-900 via-navy-800 to-azure-800 h-28 bg-gradient-to-r" />
        <div className="flex flex-wrap items-end gap-4 px-5 pb-5 sm:px-6">
          <div className="ring-surface -mt-10 rounded-full ring-4">
            <Avatar name={adminProfile.name} size="xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight">{adminProfile.name}</h2>
            <p className="text-secondary text-[13px]">{adminProfile.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="info">{adminProfile.role}</Badge>
            <Badge tone="success">2FA enabled</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Full name">
                <Input defaultValue={adminProfile.name} />
              </Field>
              <Field label="Role">
                <Input defaultValue={adminProfile.role} disabled />
              </Field>
              <Field label="Email address">
                <Input type="email" defaultValue={adminProfile.email} />
              </Field>
              <Field label="Phone">
                <Input defaultValue={adminProfile.phone} />
              </Field>
              <Field label="Department">
                <Input defaultValue={adminProfile.department} />
              </Field>
              <Field label="Location">
                <Input defaultValue={adminProfile.location} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loginSessions.map((session) => (
                <div
                  key={session.id}
                  className="border-hairline bg-surface-muted flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-surface border-hairline grid h-9 w-9 place-items-center rounded-lg border">
                      <Monitor size={16} className="text-secondary" />
                    </span>
                    <div>
                      <p className="text-[13px] font-medium">{session.device}</p>
                      <p className="text-muted text-[12px]">
                        {session.location} · {session.time}
                      </p>
                    </div>
                  </div>
                  {session.current ? (
                    <Badge tone="success">Current session</Badge>
                  ) : (
                    <Button variant="ghost" size="sm">
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>At a glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {details.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon size={16} className="text-muted mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-muted text-[11.5px] tracking-[0.06em] uppercase">
                      {item.label}
                    </p>
                    <p className="truncate text-[13px] font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {permissions.map((permission) => (
                  <li key={permission} className="flex items-start gap-2.5 text-[13px]">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span className="text-secondary">{permission}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
