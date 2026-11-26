import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return PUBLIC_ROUTES.map((route) => ({
    url: `${base}${route.path === "/" ? "" : route.path}` || base,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
