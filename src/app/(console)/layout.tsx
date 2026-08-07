import { RequireAdmin } from "@/components/providers/require-admin";
import { AdminShell } from "@/components/layout/admin-shell";

export default function ConsoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RequireAdmin>
      <AdminShell>{children}</AdminShell>
    </RequireAdmin>
  );
}
