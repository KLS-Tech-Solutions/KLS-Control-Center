import Image from "next/image";

import { cn } from "@/lib/utils";

/** KLS monogram. Sits beside the word "Admin", so the mark, not the lockup. */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/kls-mark.png"
      alt="KLS"
      width={160}
      height={97}
      priority
      style={{ width: "auto" }}
      className={cn("h-8 w-auto select-none", className)}
    />
  );
}
