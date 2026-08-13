import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

const SUPPORT_EMAIL = "klstechsolutions2025@gmail.com";


/**
 * Shown wherever we've just sent an email.
 *
 * A new sending domain lands in spam far more often than people expect, and a
 * student who never checks their junk folder is a student stuck at
 * verification with no idea why. Saying it up front costs nothing.
 */
export function SpamNote({
  className,
  action = "email",
}: {
  className?: string;
  /** What we sent, for the sentence: "the verification email". */
  action?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-field bg-canvas p-4 text-left",
        className,
      )}
    >
      <Inbox className="mt-0.5 size-4 shrink-0 text-muted" />
      <p className="text-[13px] leading-relaxed text-body">
        <span className="font-semibold text-ink">Don&apos;t see it?</span> Check your{" "}
        <span className="font-medium text-ink">Spam</span>,{" "}
        <span className="font-medium text-ink">Junk</span> or{" "}
        <span className="font-medium text-ink">Bin</span> folder — the {action} sometimes
        lands there. Mark it as <em>Not spam</em> so future updates reach your inbox, or
        write to{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-medium text-brand hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
