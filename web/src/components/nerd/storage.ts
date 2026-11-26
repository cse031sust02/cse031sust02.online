import { DEFAULT_THEME, THEMES } from "@/lib/theme/themes";

/** localStorage keys + the pre-paint script that applies them to <html> (no flash, no hydration mismatch). */
export const BOOTED_KEY = "cse031sust02:booted";
export const CRT_KEY = "cse031sust02:crt";
export const THEME_KEY = "cse031sust02:theme";
/** Set once the visitor has used the theme switch (hides the attention cue). */
export const THEME_TRIED_KEY = "cse031sust02:theme-tried";

const THEME_IDS = JSON.stringify(THEMES.map((t) => t.id).filter((id) => id !== DEFAULT_THEME));

export const PREPAINT_SCRIPT = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('${BOOTED_KEY}'))d.dataset.booted='1';if(localStorage.getItem('${CRT_KEY}')==='off')d.dataset.crt='off';var t=localStorage.getItem('${THEME_KEY}');if(${THEME_IDS}.indexOf(t)>-1)d.dataset.theme=t;}catch(e){}})();`;

export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode): ignore */
  }
}
