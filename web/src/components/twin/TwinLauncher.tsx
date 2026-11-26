"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { TwinChat } from "./TwinChat";
import { useTwin } from "./TwinProvider";

/** Floating launcher on every page (except /twin) → slide-over chat. */
export function TwinLauncher() {
  const { open, setOpen } = useTwin();
  const pathname = usePathname();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) launcherRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (pathname === "/twin") return null;

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-50 rounded-full border border-accent bg-surface px-4 py-3 font-mono text-sm text-accent shadow-glow hover:bg-accent hover:text-bg"
        >
          <span aria-hidden="true">&gt;_ </span>Chat with my twin
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-[85]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-bg/60"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chat with my digital twin"
            className="absolute top-0 right-0 flex h-dvh w-full max-w-md flex-col border-l border-border bg-surface shadow-glow"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-2 px-4 py-2 font-mono text-xs">
              <span className="text-muted">~/twin — chat</span>
              <span className="flex gap-3">
                <Link
                  href="/twin"
                  onClick={() => setOpen(false)}
                  className="text-accent-2 hover:underline"
                >
                  full screen
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-muted hover:text-fg"
                >
                  close<span className="sr-only"> chat</span>
                </button>
              </span>
            </div>
            <TwinChat autoFocus className="flex-1" />
          </div>
        </div>
      )}
    </>
  );
}
