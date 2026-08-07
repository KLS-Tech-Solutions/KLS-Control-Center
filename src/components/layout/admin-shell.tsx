"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BarChart3,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  ScrollText,
  Share2,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { useLogout, useSession } from "@/hooks/use-session";
import { can, type Capability } from "@/types";
import { usePendingCounts } from "@/hooks/use-pending-counts";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  capability?: Capability;
  /** Which pending counter to badge, if any. */
  counter?: "tasks" | "linkedin";
}

const primaryNav: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/reviews/tasks", label: "Task reviews", icon: ClipboardCheck, counter: "tasks" },
  { href: "/reviews/linkedin", label: "LinkedIn reviews", icon: Share2, counter: "linkedin" },
  { href: "/students", label: "Students", icon: Users },
  { href: "/catalogue/domains", label: "Catalogue", icon: Layers, capability: "manageCatalogue" },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/activity-logs", label: "Activity logs", icon: ScrollText, capability: "readActivityLogs" },
  { href: "/team", label: "Team", icon: UserCog, capability: "manageCatalogue" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user } = useSession();
  const logout = useLogout();
  const counts = usePendingCounts();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  const visibleNav = primaryNav.filter(
    (item) => !item.capability || can(user?.role, item.capability),
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const roleLabel = user?.role === "super_admin" ? "Super admin" : "Admin";

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/" className="flex items-center gap-2.5 px-2 text-ink">
        <Logo className="h-7 w-auto" />
        <span className="text-[15px] font-semibold">Admin</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {visibleNav.map((item) => {
          const count = item.counter ? counts[item.counter] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-body hover:bg-canvas hover:text-ink",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {count > 0 && (
                <span className="ml-auto flex min-w-5 items-center justify-center rounded-full bg-warning px-1.5 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line pt-4">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar name={user.full_name} className="size-9" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.full_name}</p>
              <p className="truncate text-xs text-muted">{roleLabel}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-field px-3 py-2.5 text-left text-sm font-medium text-body transition-colors hover:bg-canvas hover:text-ink"
        >
          <LogOut className="size-4 shrink-0" />
          {logout.isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-lift">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-full p-2 text-muted hover:bg-canvas"
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-9 items-center justify-center rounded-full text-ink lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">KLS Academy Admin</p>
            <p className="truncate text-xs text-muted">
              {counts.total > 0
                ? `${counts.total} submission${counts.total === 1 ? "" : "s"} awaiting review`
                : "Nothing awaiting review"}
            </p>
          </div>

          {counts.total > 0 && (
            <Link href="/reviews/tasks">
              <Badge variant="warning">{counts.total} pending</Badge>
            </Link>
          )}
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
