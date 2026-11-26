"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, type ThemeId, isThemeId } from "@/lib/theme/themes";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

function read(): ThemeId {
  const t = document.documentElement.dataset.theme;
  return isThemeId(t) ? t : DEFAULT_THEME;
}

/** The theme currently on <html data-theme>. Works with or without <NerdProvider>. */
export function useActiveTheme(): ThemeId {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_THEME);
}
