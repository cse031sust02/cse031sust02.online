"use client";

import { useCallback, useEffect, useState } from "react";
import { BOOTED_KEY, safeGet, safeSet } from "./storage";
import { usePrefersReducedMotion } from "./use-reduced-motion";

const BOOT_MS = 1500;

/**
 * First-visit boot screen (~1.5 s), skippable by any key or click, remembered in localStorage.
 * The server always renders it; the pre-paint script hides it (html[data-booted]) for returning
 * visitors and reduced-motion users, and a CSS fallback hides it if JS never runs.
 */
export function BootSequence({ lines }: { lines: string[] }) {
  const [done, setDone] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const finish = useCallback(() => {
    safeSet(BOOTED_KEY, "1");
    document.documentElement.dataset.booted = "1";
    setDone(true);
  }, []);

  useEffect(() => {
    // Returning visitors / reduced motion: CSS already hides the overlay (html[data-booted]).
    if (done || safeGet(BOOTED_KEY) || reducedMotion) return;
    const timer = window.setTimeout(finish, BOOT_MS);
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [done, finish, reducedMotion]);

  if (done) return null;

  return (
    <div
      className="boot-overlay fixed inset-0 z-[100] flex items-center justify-center bg-bg p-6"
      role="dialog"
      aria-modal="true"
      aria-label="cse031sust02 boot sequence"
      data-testid="boot"
    >
      <div className="w-full max-w-lg font-mono text-sm">
        {lines.map((line, i) => (
          <p key={line} className="boot-line" style={{ animationDelay: `${i * 220}ms` }}>
            <span className="text-accent">[ ok ]</span> {line}
          </p>
        ))}
        <p className="mt-6 text-muted">
          Press any key or click to skip<span className="cursor-blink text-accent">▋</span>
        </p>
      </div>
    </div>
  );
}
