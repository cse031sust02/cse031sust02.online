"use client";

import { useEffect, useState } from "react";
import { useTwinOptional } from "@/components/twin/TwinProvider";
import { THEMES, type ThemeId } from "@/lib/theme/themes";
import { useNerd } from "./NerdProvider";
import { THEME_TRIED_KEY, safeGet, safeSet } from "./storage";

const ICON: Record<ThemeId, string> = { terminal: "◐", mirage: "✦" };
/** The callout fades out on its own; the pulsing ring stays until the switch is used. */
const CALLOUT_MS = 12_000;

/**
 * Header theme switch: a two-option segmented control (Terminal | Mirage) so the choice is
 * visible at a glance. Until the visitor has tried it, a pulsing ring and a one-time callout
 * invite them to switch. The callout steps aside while the chat or command palette is open.
 */
export function ThemeSwitch() {
  const { theme, setTheme, paletteOpen } = useNerd();
  const twin = useTwinOptional();
  const [tried, setTried] = useState(true);
  const [calloutExpired, setCalloutExpired] = useState(false);

  useEffect(() => {
    // localStorage is client-only: read after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTried(safeGet(THEME_TRIED_KEY) === "1");
    const timer = window.setTimeout(() => setCalloutExpired(true), CALLOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const showCallout = !tried && !calloutExpired && !paletteOpen && !twin?.open;

  const markTried = () => {
    safeSet(THEME_TRIED_KEY, "1");
    setTried(true);
  };

  const other = THEMES.find((t) => t.id !== theme)!;

  const choose = (id: ThemeId) => {
    markTried();
    if (id !== theme) setTheme(id);
  };

  return (
    <div className="relative shrink-0">
      <div
        role="group"
        aria-label="Site theme"
        className={`theme-switch flex items-center rounded-full border border-accent/60 bg-surface p-0.5 font-mono text-xs ${
          tried ? "" : "theme-switch-attention"
        }`}
        data-testid="theme-switch"
      >
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              aria-label={`${t.label} theme`}
              title={`${t.label}: ${t.description}`}
              onClick={() => choose(t.id)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
                active ? "bg-accent font-bold text-bg" : "text-muted hover:text-accent"
              }`}
            >
              <span aria-hidden="true">{ICON[t.id]}</span>
              <span aria-hidden="true" className="hidden sm:inline">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {showCallout && (
        <div
          className="theme-callout absolute right-0 top-full z-50 mt-3 w-60 rounded-window border border-accent bg-surface p-3 font-sans text-sm text-fg shadow-glow"
          data-testid="theme-callout"
        >
          <span
            aria-hidden="true"
            className="absolute -top-1.5 right-8 size-3 rotate-45 border-l border-t border-accent bg-surface"
          />
          <p className="font-semibold text-accent">✦ This site has two designs</p>
          <p className="mt-1 text-muted">
            {other.label}: {other.description}.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => choose(other.id)}
              className="rounded-full bg-accent px-3 py-1 font-mono text-xs font-bold text-bg hover:opacity-90"
            >
              Try {other.label} {ICON[other.id]}
            </button>
            <button
              type="button"
              onClick={markTried}
              className="font-mono text-xs text-muted hover:text-accent"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
