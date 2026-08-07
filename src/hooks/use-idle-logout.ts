"use client";

import * as React from "react";

/** 30 minutes, per the production security requirement. */
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

/** Warn two minutes before signing the user out. */
const WARNING_BEFORE_MS = 2 * 60 * 1000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
  "wheel",
] as const;

/**
 * Signs the user out after a period of inactivity.
 *
 * The timestamp lives in localStorage so several open tabs share one clock —
 * otherwise a background tab would sign you out while you were working in
 * another. Only a timestamp is stored; no token ever touches web storage.
 */
export function useIdleLogout({
  enabled,
  onIdle,
  onWarning,
  timeoutMs = IDLE_TIMEOUT_MS,
}: {
  enabled: boolean;
  onIdle: () => void;
  onWarning?: (secondsRemaining: number) => void;
  timeoutMs?: number;
}) {
  const lastWarned = React.useRef(false);

  React.useEffect(() => {
    if (!enabled) return;

    const STORAGE_KEY = "kls_last_activity";
    const stamp = () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        // Private mode or storage disabled — fall back to this tab only.
      }
      lastWarned.current = false;
    };

    const lastActivity = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? Number(raw) : Date.now();
      } catch {
        return Date.now();
      }
    };

    stamp();

    // Throttled: mousemove fires constantly and does not need to write often.
    let throttled = false;
    const onActivity = () => {
      if (throttled) return;
      throttled = true;
      stamp();
      setTimeout(() => {
        throttled = false;
      }, 5_000);
    };

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, onActivity, { passive: true }),
    );

    const interval = window.setInterval(() => {
      const idleFor = Date.now() - lastActivity();

      if (idleFor >= timeoutMs) {
        onIdle();
        return;
      }

      if (
        onWarning &&
        !lastWarned.current &&
        idleFor >= timeoutMs - WARNING_BEFORE_MS
      ) {
        lastWarned.current = true;
        onWarning(Math.round((timeoutMs - idleFor) / 1000));
      }
    }, 15_000);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, onActivity),
      );
      window.clearInterval(interval);
    };
  }, [enabled, onIdle, onWarning, timeoutMs]);
}
