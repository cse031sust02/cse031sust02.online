"use client";

import { nextTheme, themeLabel } from "@/lib/theme/themes";
import { useNerd } from "./NerdProvider";

const btn =
  "rounded-chip border border-border px-2 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent";

/** Clickable equivalents for the theme, the CRT toggle and matrix mode (Konami code). */
export function NerdToggles() {
  const { crt, toggleCrt, matrix, toggleMatrix, theme, cycleTheme } = useNerd();
  return (
    <div className="flex gap-2">
      <button type="button" className={btn} onClick={cycleTheme}>
        theme: {themeLabel(theme).toLowerCase()}
        <span className="sr-only"> (switch to {themeLabel(nextTheme(theme))})</span>
      </button>
      {/* Scanlines belong to the terminal look only. */}
      <button
        type="button"
        className={`${btn} theme-terminal`}
        aria-pressed={crt}
        onClick={toggleCrt}
      >
        CRT {crt ? "on" : "off"}
      </button>
      <button type="button" className={btn} aria-pressed={matrix} onClick={toggleMatrix}>
        matrix {matrix ? "on" : "off"}
      </button>
    </div>
  );
}
