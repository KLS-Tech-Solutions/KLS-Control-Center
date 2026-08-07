import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">404</p>
        <h1 className="mt-4 text-4xl">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-body">
          The link may be broken or the page may have moved.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-8")}>
          Back to overview
        </Link>
      </div>
    </div>
  );
}
