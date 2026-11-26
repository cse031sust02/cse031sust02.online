import type { Profile } from "@/lib/content/schema";

/** schema.org Person for the home page. Only public facts: no email, no phone. */
export function personJsonLd(profile: Profile, siteUrl: string) {
  const current = profile.experience[0];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.basics.name,
    jobTitle: profile.basics.title,
    description: profile.basics.tagline,
    url: siteUrl,
    sameAs: profile.links.map((l) => l.url),
    knowsAbout: profile.skills.flatMap((s) => s.items).slice(0, 30),
    alumniOf: [...new Set(profile.education.map((e) => e.institution))].map((name) => ({
      "@type": "EducationalOrganization",
      name,
    })),
    ...(current && current.end === "present"
      ? { worksFor: { "@type": "Organization", name: current.company } }
      : {}),
  };
}

/** Serializes JSON-LD safely for a <script> tag (no `</script>` breakout). */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
