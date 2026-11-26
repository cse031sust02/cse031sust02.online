import { expect, test } from "@playwright/test";
import { skipBoot } from "./helpers";

test.beforeEach(async ({ page }) => skipBoot(page));

test("shows 'agent offline' when the server has no API key", async ({ page }) => {
  // The e2e server runs without OPENROUTER_API_KEY.
  await page.goto("/twin");
  await page.getByRole("textbox", { name: /ask the ai agent/i }).fill("Hello?");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("agent offline");
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
  await page.getByRole("button", { name: /^Ask .+ AI Agent$/ }).click();
  const dialog = page.getByRole("dialog", { name: /ai agent/i });
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
  const dialog = page.getByRole("dialog", { name: /ai agent/i });
  await expect(dialog.getByTestId("twin-reply")).toContainText("Hi!");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("agent UI: thinking indicator, status, follow-up chips and new chat", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  await page.route("/api/chat", async (route) => {
    await gate;
    await route.fulfill({ status: 200, body: "Happy to help." });
  });
  await page.goto("/twin");
  await expect(page.getByTestId("agent-status")).toContainText("online");
  await page.getByRole("list", { name: "Suggested questions" }).getByRole("button").first().click();

  await expect(page.getByTestId("twin-thinking")).toBeVisible();
  await expect(page.getByTestId("agent-status")).toContainText("thinking");
  release();

  await expect(page.getByTestId("twin-reply")).toContainText("Happy to help.");
  await expect(page.getByTestId("twin-thinking")).toHaveCount(0);
  const followUps = page.getByRole("list", { name: "Follow-up suggestions" }).getByRole("button");
  await expect(followUps.first()).toBeVisible();
  await expect(page.getByRole("button", { name: "copy reply" })).toBeVisible();

  await page.getByRole("button", { name: "new chat" }).click();
  await expect(page.getByTestId("twin-reply")).toHaveCount(0);
});

test("terminal 'agent <q>' asks the AI agent", async ({ page }) => {
  await page.route("/api/chat", (route) => route.fulfill({ status: 200, body: "Terminal answer" }));
  await page.goto("/#terminal");
  const input = page.getByRole("textbox", { name: /terminal command/i });
  await input.fill("agent hi there");
  await input.press("Enter");
  await expect(page.getByRole("log", { name: "Terminal output" })).toContainText(
    "agent> Terminal answer",
  );
});

test("chat window maximizes and minimizes in place", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Ask .+ AI Agent$/ }).click();
  const dialog = page.getByRole("dialog", { name: /ai agent/i });
  await expect(dialog).toHaveAttribute("data-expanded", "false");
  await dialog.getByRole("button", { name: "Maximize chat" }).click();
  await expect(dialog).toHaveAttribute("data-expanded", "true");
  await dialog.getByRole("button", { name: "Minimize chat" }).click();
  await expect(dialog).toHaveAttribute("data-expanded", "false");
  await expect(page).toHaveURL(/\/$/);
});

test("teaser 'Open full screen' opens the maximized chat", async ({ page }) => {
  await page.goto("/#twin");
  await page.locator("#twin").getByRole("button", { name: "Open full screen" }).click();
  await expect(page.getByRole("dialog", { name: /ai agent/i })).toHaveAttribute(
    "data-expanded",
    "true",
  );
});

test("/twin minimizes back to the side-panel chat on the home page", async ({ page }) => {
  await page.goto("/twin");
  await page.getByRole("button", { name: "Minimize chat" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog", { name: /ai agent/i })).toHaveAttribute(
    "data-expanded",
    "false",
  );
});
