/** Public base URL (no trailing slash). NEXT_PUBLIC_* is inlined at build time. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://cse031sust02.online";
  return raw.replace(/\/+$/, "");
}

/** Indexable routes, shared by the sitemap. Add /blog, /lab here when they exist. */
export const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/twin", priority: 0.6, changeFrequency: "monthly" },
] as const;
