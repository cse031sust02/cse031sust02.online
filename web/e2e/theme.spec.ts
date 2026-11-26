import { expect, test } from "@playwright/test";
import { skipBoot, useTheme } from "./helpers";

test.describe("themes", () => {
  test.beforeEach(async ({ page }) => skipBoot(page));

  test("defaults to Terminal: ASCII hero, no Mirage art", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    await expect(page.getByTestId("ascii-name")).toBeVisible();
    await expect(page.getByTestId("mirage-scene")).toBeHidden();
  });

  test("header button switches to Mirage and the choice is remembered", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("theme-callout")).toBeVisible();
    await page.getByRole("button", { name: "Mirage theme" }).click();
    await expect(page.getByRole("button", { name: "Mirage theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByTestId("theme-callout")).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mirage");
    await expect(page.getByTestId("mirage-scene")).toBeVisible();
    await expect(page.getByTestId("ascii-name")).toBeHidden();
    await expect(page.getByTestId("scanlines")).toBeHidden();

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mirage");
    await expect(page.getByTestId("theme-callout")).toBeHidden();
    await page.getByRole("button", { name: "Terminal theme" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });

  test("the callout's link switches theme; Dismiss hides it for good", async ({ page }) => {
    await page.goto("/");
    const callout = page.getByTestId("theme-callout");
    await callout.getByRole("button", { name: /try mirage/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mirage");
    await expect(callout).toBeHidden();

    await page.evaluate(() => localStorage.removeItem("cse031sust02:theme-tried"));
    await page.reload();
    await page.getByTestId("theme-callout").getByRole("button", { name: "Dismiss" }).click();
    await page.reload();
    await expect(page.getByTestId("theme-switch")).toBeVisible();
    await expect(page.getByTestId("theme-callout")).toBeHidden();
  });

  test("a stored theme is applied before paint (no flash)", async ({ page }) => {
    await useTheme(page, "mirage");
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForSelector("body");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mirage");
  });

  test("an unknown stored theme falls back to Terminal", async ({ page }) => {
    await useTheme(page, "neon");
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });

  test("Mirage shows the Arabic calligraphy name from the profile", async ({ page }) => {
    await useTheme(page, "mirage");
    await page.goto("/");
    await expect(page.locator(".mirage-calligraphy")).toHaveText("طلحة ابن إمام");
  });

  test("the terminal `theme` command and the palette switch themes", async ({ page }) => {
    await page.goto("/#terminal");
    const input = page.getByRole("textbox", { name: /terminal command/i });
    await input.fill("theme mirage");
    await input.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mirage");

    await page.keyboard.press("Control+k");
    await page.keyboard.type("theme: switch");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });
});
