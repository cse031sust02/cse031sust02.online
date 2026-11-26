import { expect, test } from "@playwright/test";
import { skipBoot } from "./helpers";

test.beforeEach(async ({ page }) => skipBoot(page));

test("shows 'twin offline' when the server has no API key", async ({ page }) => {
  // The e2e server runs without OPENROUTER_API_KEY.
  await page.goto("/twin");
  await page.getByRole("textbox", { name: /ask the twin/i }).fill("Hello?");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("twin offline");
});

test("streams a markdown reply in the slide-over without executing HTML", async ({ page }) => {
  await page.route("/api/chat", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "I build **AI products**.\n\n- one\n- two\n\n<script>window.__pwned=1</script>",
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: /chat with my twin/i })
    .last()
    .click();
  const dialog = page.getByRole("dialog", { name: /digital twin/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox").fill("What do you build?");
  await dialog.getByRole("button", { name: "send" }).click();

  const reply = dialog.getByTestId("twin-reply");
  await expect(reply.locator("strong")).toHaveText("AI products");
  await expect(reply.locator("li")).toHaveCount(2);
  await expect(reply).toContainText("<script>");
  expect(
    await page.evaluate(() => (window as unknown as { __pwned?: number }).__pwned),
  ).toBeUndefined();

  // Conversation persists in sessionStorage across pages.
  await page.goto("/twin");
  await expect(page.getByTestId("twin-reply")).toContainText("AI products");
});

test("home teaser prompt opens the chat; Esc closes it", async ({ page }) => {
  await page.route("/api/chat", (route) => route.fulfill({ status: 200, body: "Hi!" }));
  await page.goto("/#twin");
  await page.locator("#twin").getByRole("button").first().click();
  const dialog = page.getByRole("dialog", { name: /digital twin/i });
  await expect(dialog.getByTestId("twin-reply")).toContainText("Hi!");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("terminal 'twin <q>' asks the twin", async ({ page }) => {
  await page.route("/api/chat", (route) => route.fulfill({ status: 200, body: "Terminal answer" }));
  await page.goto("/#terminal");
  const input = page.getByRole("textbox", { name: /terminal command/i });
  await input.fill("twin hi there");
  await input.press("Enter");
  await expect(page.getByRole("log", { name: "Terminal output" })).toContainText(
    "twin> Terminal answer",
  );
});
