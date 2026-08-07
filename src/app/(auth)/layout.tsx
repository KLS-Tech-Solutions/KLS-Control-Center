import Link from "next/link";

import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-brand-50 opacity-70 blur-3xl" />
      </div>

      <header className="relative z-10 px-5 py-6 sm:px-8">
        <Link href="/login" className="flex items-center gap-2.5 text-ink">
          <Logo className="h-7 w-auto" />
          <span className="text-[15px] font-semibold">Admin</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-16 pt-4 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="relative z-10 px-5 pb-6 text-center text-[13px] text-muted">
        © {new Date().getFullYear()} KLS Tech Solutions · MSME registered
      </footer>
    </div>
  );
}
