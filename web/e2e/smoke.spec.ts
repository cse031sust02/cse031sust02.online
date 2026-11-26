import { expect, test } from "@playwright/test";

test("home page shows the TalhaOS prompt", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/TalhaOS/);
  await expect(page.getByText(/:~\$ whoami/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("health endpoint responds ok", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ status: "ok" });
});
