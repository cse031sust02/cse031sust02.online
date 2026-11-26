import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { skipBoot, useTheme } from "./helpers";

// Lighthouse's accessibility category is built on axe-core; this keeps it checked in CI.
for (const theme of ["terminal", "mirage"]) {
  test(`home page has no WCAG A/AA accessibility violations (${theme} theme)`, async ({ page }) => {
    await skipBoot(page);
    await useTheme(page, theme);
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`);
    expect(summary).toEqual([]);
  });
}
