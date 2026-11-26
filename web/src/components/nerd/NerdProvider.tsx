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
import { CRT_KEY, safeSet } from "./storage";

type NerdState = {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  matrix: boolean;
  toggleMatrix: () => void;
  crt: boolean;
  toggleCrt: () => void;
};

const NerdContext = createContext<NerdState | null>(null);

export function useNerd(): NerdState {
  const ctx = useContext(NerdContext);
  if (!ctx) throw new Error("useNerd must be used inside <NerdProvider>");
  return ctx;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** Global nerd-layer state: command palette, matrix mode (Konami), CRT scanlines. */
export function NerdProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [matrix, setMatrix] = useState(false);
  // The pre-paint script already applied the stored CRT preference to <html>.
  const [crt, setCrt] = useState(true);

  useEffect(() => {
    // Sync React state with what the pre-paint script applied to <html> (client-only data).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCrt(document.documentElement.dataset.crt !== "off");
  }, []);

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
    () => ({ paletteOpen, setPaletteOpen, matrix, toggleMatrix, crt, toggleCrt }),
    [paletteOpen, matrix, toggleMatrix, crt, toggleCrt],
  );
  return <NerdContext.Provider value={value}>{children}</NerdContext.Provider>;
}
