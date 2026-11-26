import { describe, expect, it } from "vitest";
import { containsEmail, containsPhone } from "@/lib/content/privacy";
import { makeFixtureProfile } from "@/test/fixture-profile";
import { jsonLdScript, personJsonLd } from "./person-jsonld";

describe("personJsonLd", () => {
  const profile = makeFixtureProfile();
  const data = personJsonLd(profile, "https://example.dev");

  it("describes the person with links as sameAs", () => {
    expect(data).toMatchObject({
      "@type": "Person",
      name: "Ada Fixture",
      jobTitle: "Engineering Manager",
    });
    expect(data.sameAs).toEqual(profile.links.map((l) => l.url));
  });

  it("contains no email or phone", () => {
    const text = JSON.stringify(data);
    expect(text).not.toMatch(/"email"|"telephone"/);
    expect(containsEmail(text)).toBe(false);
    expect(containsPhone(text)).toBe(false);
  });

  it("escapes < so the script tag can't be closed early", () => {
    expect(jsonLdScript({ a: "</script>" })).not.toContain("</script>");
  });
});
