import { RequireAdmin } from "@/components/providers/require-admin";
import { IdleLogout } from "@/components/providers/idle-logout";
import { AdminShell } from "@/components/layout/admin-shell";

export default function ConsoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RequireAdmin>
      <IdleLogout />
      <AdminShell>{children}</AdminShell>
    </RequireAdmin>
  );
}
