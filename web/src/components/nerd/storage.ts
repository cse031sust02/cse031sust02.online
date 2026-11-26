/** localStorage keys + the pre-paint script that applies them to <html> (no flash, no hydration mismatch). */
export const BOOTED_KEY = "cse031sust02:booted";
export const CRT_KEY = "cse031sust02:crt";

export const PREPAINT_SCRIPT = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('${BOOTED_KEY}'))d.dataset.booted='1';if(localStorage.getItem('${CRT_KEY}')==='off')d.dataset.crt='off';}catch(e){}})();`;

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
