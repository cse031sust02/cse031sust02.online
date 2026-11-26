import { expect, test } from "@playwright/test";
import { skipBoot } from "./helpers";

test.beforeEach(async ({ page }) => skipBoot(page));

test("without SMTP the form says contact is temporarily unavailable", async ({ page }) => {
  await page.goto("/#contact");
  await page.waitForTimeout(3100); // minimum time-to-submit
  await page.getByLabel("$ name").fill("E2E Visitor");
  await page.getByLabel("$ email").fill("visitor@example.org");
  await page.getByLabel("$ message").fill("Hello from the end-to-end test!");
  await page.getByRole("button", { name: "./send" }).click();
  await expect(page.getByRole("status").filter({ hasText: /unavailable/ })).toContainText(
    "Contact temporarily unavailable",
  );
});

test("invalid fields show inline errors", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByLabel("$ email").fill("not-an-email");
  await page.getByRole("button", { name: "./send" }).click();
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
});

test("terminal 'contact' scrolls to and focuses the form", async ({ page }) => {
  await page.goto("/#terminal");
  const input = page.getByRole("textbox", { name: /terminal command/i });
  await input.fill("contact");
  await input.press("Enter");
  await expect(page.getByLabel("$ name")).toBeFocused();
});

test("palette 'contact' focuses the form", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.keyboard.type("contact: send");
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("$ name")).toBeFocused();
});

test("the page never shows an email address", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  expect(html).not.toMatch(/mailto:/i);
  expect(html).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
});
