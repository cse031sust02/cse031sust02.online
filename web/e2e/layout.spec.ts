import { expect, test } from "@playwright/test";
import { skipBoot } from "./helpers";

test.describe("mobile layout", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("has no horizontal scroll at 360px", async ({ page }) => {
    await skipBoot(page);
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test("nav anchors lead to sections", async ({ page }) => {
  await page.goto("/");
  for (const id of ["about", "experience", "products", "skills", "credentials", "contact"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});
