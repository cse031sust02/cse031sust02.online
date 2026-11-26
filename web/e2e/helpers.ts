import type { Page } from "@playwright/test";

/** Mark the boot sequence as seen so it doesn't cover the page. */
export async function skipBoot(page: Page) {
  await page.addInitScript(() => localStorage.setItem("cse031sust02:booted", "1"));
}

/** Start the visit with a stored theme (as a returning visitor would have). */
export async function useTheme(page: Page, theme: string) {
  await page.addInitScript((t) => localStorage.setItem("cse031sust02:theme", t), theme);
}
