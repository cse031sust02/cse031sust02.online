"use client";

import { useNerd } from "./NerdProvider";

const btn =
  "rounded-chip border border-border px-2 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent";

/** Clickable equivalents for the CRT toggle and matrix mode (Konami code). */
export function NerdToggles() {
  const { crt, toggleCrt, matrix, toggleMatrix } = useNerd();
  return (
    <div className="flex gap-2">
      <button type="button" className={btn} aria-pressed={crt} onClick={toggleCrt}>
        CRT {crt ? "on" : "off"}
      </button>
      <button type="button" className={btn} aria-pressed={matrix} onClick={toggleMatrix}>
        matrix {matrix ? "on" : "off"}
      </button>
    </div>
  );
}
