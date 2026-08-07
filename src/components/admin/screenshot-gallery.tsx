"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/primitives";
import type { TaskScreenshot } from "@/types";

/**
 * Evidence viewer. Screenshots are the main thing a reviewer judges, so they
 * open full-size in a lightbox with keyboard navigation rather than forcing a
 * right-click into a new tab.
 */
export function ScreenshotGallery({
  screenshots,
  className,
}: {
  screenshots: TaskScreenshot[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const close = React.useCallback(() => setOpenIndex(null), []);
  const step = React.useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null
          ? null
          : (current + delta + screenshots.length) % screenshots.length,
      ),
    [screenshots.length],
  );

  React.useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  if (screenshots.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff />}
        title="No screenshots"
        description="This submission has no attached evidence, which on its own is grounds to send it back."
        className={className}
      />
    );
  }

  return (
    <>
      <ul className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {screenshots.map((shot, index) => (
          <li key={shot.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block w-full overflow-hidden rounded-field border border-line bg-canvas"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.image_url}
                alt={`Screenshot ${shot.display_order}`}
                className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition-all duration-200 group-hover:bg-ink/40 group-hover:opacity-100">
                <ZoomIn className="size-6" />
              </span>
              <span className="absolute left-2 top-2 rounded-pill bg-ink/70 px-2 py-0.5 text-[11px] font-medium text-white">
                {shot.display_order}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {screenshots.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous"
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next"
                className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshots[openIndex].image_url}
            alt={`Screenshot ${screenshots[openIndex].display_order}`}
            className="max-h-[85vh] max-w-full rounded-card object-contain"
          />

          <p className="absolute bottom-5 rounded-pill bg-white/10 px-3 py-1 text-sm text-white">
            {openIndex + 1} of {screenshots.length}
          </p>
        </div>
      )}
    </>
  );
}
