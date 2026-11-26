import { expect, test } from "@playwright/test";
import { skipBoot } from "./helpers";

test.describe("boot sequence", () => {
  test("shows on the first visit, is skippable by key, and not shown on reload", async ({
    page,
  }) => {
    await page.goto("/");
    const boot = page.getByTestId("boot");
    await expect(boot).toBeVisible();
    await page.keyboard.press("Space");
    await expect(boot).toBeHidden();
    await page.reload();
    await expect(page.getByTestId("boot")).toBeHidden();
  });

  test("is skippable by click", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("boot")).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.getByTestId("boot")).toBeHidden();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("disables boot, typewriter, canvas animation and scanlines", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("boot")).toBeHidden();
    await expect(page.getByTestId("scanlines")).toBeHidden();
    const tagline = await page
      .locator("p:has(> [data-testid=typewriter]) > .sr-only")
      .textContent();
    await expect(page.getByTestId("typewriter")).toContainText(tagline!.trim());
    await page.waitForTimeout(300);
    await expect(page.getByTestId("matrix-canvas").first()).toHaveAttribute(
      "data-animating",
      "false",
    );
  });
});

test.describe("with motion", () => {
  test("animates the hero canvas and shows scanlines", async ({ page }) => {
    await skipBoot(page);
    await page.goto("/");
    await expect(page.getByTestId("matrix-canvas").first()).toHaveAttribute(
      "data-animating",
      "true",
    );
    await expect(page.getByTestId("scanlines")).toBeVisible();
  });

  test("CRT toggle hides scanlines and is remembered", async ({ page }) => {
    await skipBoot(page);
    await page.goto("/");
    await page.getByRole("button", { name: /^CRT/ }).click();
    await expect(page.getByTestId("scanlines")).toBeHidden();
    await page.reload();
    await expect(page.getByTestId("scanlines")).toBeHidden();
  });
});

test.describe("command palette", () => {
  test.beforeEach(async ({ page }) => {
    await skipBoot(page);
    await page.goto("/");
  });

  test("opens with Ctrl+K and closes with Esc", async ({ page }) => {
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("opens with Meta+K and the header button", async ({ page }) => {
    await page.keyboard.press("Meta+k");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /open command palette/i }).click();
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  });

  test("selecting a section scrolls to it", async ({ page }) => {
    await page.keyboard.press("Control+k");
    await page.keyboard.type("skills");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#skills$/);
    await expect(page.locator("#skills")).toBeInViewport();
  });
});

test("konami code toggles matrix mode", async ({ page }) => {
  await skipBoot(page);
  await page.goto("/");
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  for (const key of [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ]) {
    await page.keyboard.press(key);
  }
  await expect(page.getByTestId("matrix-mode")).toBeVisible();
});

test("terminal runs commands", async ({ page }) => {
  await skipBoot(page);
  await page.goto("/#terminal");
  const input = page.getByRole("textbox", { name: /terminal command/i });
  await input.fill("whoami");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("status:");
  await input.fill("foo");
  await input.press("Enter");
  await expect(page.getByRole("log")).toContainText("command not found: foo");
});
