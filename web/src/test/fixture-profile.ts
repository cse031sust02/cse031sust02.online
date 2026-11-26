import { type Profile, profileSchema } from "@/lib/content/schema";

/** A small, valid profile used by unit tests (independent of the real content file). */
export function makeFixtureProfile(overrides: Partial<Profile> = {}): Profile {
  return profileSchema.parse({
    basics: {
      name: "Ada Fixture",
      handle: "adafix",
      title: "Engineering Manager",
      tagline: "Shipping fixture products.",
      years_of_experience: 12,
      summary: "Fixture summary about leading teams.",
      status: "Currently freelancing. Open to interesting opportunities.",
    },
    stats: [{ label: "Years in software", value: "12+" }],
    links: [
      { label: "GitHub", url: "https://github.com/adafix", icon: "github" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/adafix", icon: "linkedin" },
    ],
    experience: [
      {
        company: "Fixture Corp",
        role: "Engineering Manager",
        start: "2021-01",
        end: "present",
        highlights: ["Led the fixture platform."],
        tech: ["Python", "Django"],
      },
      {
        company: "Old Startup",
        role: "Developer",
        start: "2015-03",
        end: "2020-12",
        highlights: ["Built the first product."],
        tech: [],
      },
    ],
    products: [
      {
        name: "FixtureGPT",
        company: "Fixture Corp",
        role: "Engineering Manager",
        start: "2022-01",
        end: "present",
        description: "An assistant for fixtures.",
        url: "https://example.com/fixturegpt",
        tags: ["LLMs"],
      },
    ],
    skills: [
      { group: "Leadership", items: ["Hiring", "Mentoring"] },
      { group: "Languages", items: ["Python", "TypeScript"] },
    ],
    education: [
      { institution: "Fixture University", degree: "BSc in CSE", start: 2003, end: 2008 },
    ],
    certifications: [
      {
        name: "Fixture Cert",
        issuer: "Fixture Academy",
        date: "2020-04",
        url: "https://example.com/cert",
      },
    ],
    awards: [{ name: "Fixture Award", year: 2011, for: "Fixture App" }],
    twin_notes: {
      current_focus: "Fixture-driven development.",
      fun_facts: ["Once wrote a test for a test."],
      faq: [{ q: "Favourite stack?", a: "Whatever ships." }],
    },
    ...overrides,
  });
}
