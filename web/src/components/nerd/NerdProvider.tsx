"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createKonamiMatcher } from "@/lib/nerd/konami";
import { DEFAULT_THEME, type ThemeId, isThemeId, nextTheme } from "@/lib/theme/themes";
import { CRT_KEY, THEME_KEY, safeSet } from "./storage";

type NerdState = {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  matrix: boolean;
  toggleMatrix: () => void;
  crt: boolean;
  toggleCrt: () => void;
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  cycleTheme: () => void;
};

const NerdContext = createContext<NerdState | null>(null);

export function useNerd(): NerdState {
  const ctx = useContext(NerdContext);
  if (!ctx) throw new Error("useNerd must be used inside <NerdProvider>");
  return ctx;
}

/** Same as useNerd, but returns null outside the provider (e.g. isolated component tests). */
export function useNerdOptional(): NerdState | null {
  return useContext(NerdContext);
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** Writes the theme to <html data-theme> (absent = default) with a short colour cross-fade. */
function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  if (theme === DEFAULT_THEME) delete root.dataset.theme;
  else root.dataset.theme = theme;
  window.setTimeout(() => root.classList.remove("theme-switching"), 450);
}

/** Global nerd-layer state: command palette, matrix mode (Konami), CRT scanlines, theme. */
export function NerdProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [matrix, setMatrix] = useState(false);
  // The pre-paint script already applied the stored CRT preference to <html>.
  const [crt, setCrt] = useState(true);
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    // Sync React state with what the pre-paint script applied to <html> (client-only data).
    const root = document.documentElement;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCrt(root.dataset.crt !== "off");
    setThemeState(isThemeId(root.dataset.theme) ? root.dataset.theme : DEFAULT_THEME);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    applyTheme(next);
    safeSet(THEME_KEY, next);
    setThemeState(next);
  }, []);

  const cycleTheme = useCallback(() => setTheme(nextTheme(theme)), [setTheme, theme]);

  const toggleCrt = useCallback(() => {
    setCrt((on) => {
      const next = !on;
      if (next) delete document.documentElement.dataset.crt;
      else document.documentElement.dataset.crt = "off";
      safeSet(CRT_KEY, next ? "on" : "off");
      return next;
    });
  }, []);

  const toggleMatrix = useCallback(() => setMatrix((m) => !m), []);

  useEffect(() => {
    const konami = createKonamiMatcher();
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (isTypingTarget(e.target)) return;
      if (konami(e.key)) setMatrix((m) => !m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-matrix", matrix);
  }, [matrix]);

  const value = useMemo(
    () => ({
      paletteOpen,
      setPaletteOpen,
      matrix,
      toggleMatrix,
      crt,
      toggleCrt,
      theme,
      setTheme,
      cycleTheme,
    }),
    [paletteOpen, matrix, toggleMatrix, crt, toggleCrt, theme, setTheme, cycleTheme],
  );
  return <NerdContext.Provider value={value}>{children}</NerdContext.Provider>;
}
