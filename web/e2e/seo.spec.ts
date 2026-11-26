import { expect, test } from "@playwright/test";

const SITE = "https://cse031sust02.online"; // e2e builds without NEXT_PUBLIC_SITE_URL → default

test("sitemap.xml lists the site URLs", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain("<urlset");
  expect(xml).toContain(`<loc>${SITE}</loc>`);
  expect(xml).toContain(`<loc>${SITE}/twin</loc>`);
});

test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const txt = await res.text();
  expect(txt).toMatch(/User-Agent: \*/i);
  expect(txt).toContain("Disallow: /api/");
  expect(txt).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});

test("opengraph-image is a 1200×630 PNG", async ({ request }) => {
  const res = await request.get("/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/png");
  const png = await res.body();
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});

test("home has a Person JSON-LD without email or phone, plus canonical + OG tags", async ({
  page,
}) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw!);
  expect(data["@type"]).toBe("Person");
  expect(data.name).toBeTruthy();
  expect(data.sameAs.length).toBeGreaterThan(0);
  expect(raw).not.toMatch(/@[a-z0-9-]+\.[a-z]{2,}|"email"|"telephone"/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /opengraph-image/,
  );
});

test("unknown routes render the custom 404 with status 404", async ({ page }) => {
  const res = await page.goto("/definitely-not-here");
  expect(res!.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404: command not found" })).toBeVisible();
});

test("security headers are present on /", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["permissions-policy"]).toContain("camera=()");
  expect(h["x-powered-by"]).toBeUndefined();
});
