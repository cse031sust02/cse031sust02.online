"use client";

import { useNerd } from "./NerdProvider";

/** Clickable equivalent of ⌘K / Ctrl+K. */
export function PaletteButton() {
  const { setPaletteOpen } = useNerd();
  return (
    <button
      type="button"
      onClick={() => setPaletteOpen(true)}
      className="shrink-0 rounded-chip border border-border px-2 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent"
      aria-haspopup="dialog"
    >
      ⌘K<span className="sr-only"> open command palette</span>
    </button>
  );
}
