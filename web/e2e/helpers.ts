import type { Page } from "@playwright/test";

/** Mark the boot sequence as seen so it doesn't cover the page. */
export async function skipBoot(page: Page) {
  await page.addInitScript(() => localStorage.setItem("talhaos:booted", "1"));
}
