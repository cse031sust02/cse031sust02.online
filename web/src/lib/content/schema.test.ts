// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse, stringify } from "yaml";
import { ProfileValidationError, parseProfile } from "./parse";

const realYaml = readFileSync(path.join(process.cwd(), "content", "profile.yaml"), "utf8");

// Loose YAML tree so tests can poke at any path.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mutate(edit: (data: Record<string, any>) => void): string {
  const data = parse(realYaml);
  edit(data);
  return stringify(data);
}

function issuesOf(yamlText: string): string[] {
  try {
    parseProfile(yamlText);
  } catch (error) {
    expect(error).toBeInstanceOf(ProfileValidationError);
    return (error as ProfileValidationError).issues;
  }
  throw new Error("expected validation to fail");
}

describe("profile schema", () => {
  it("validates the real content/profile.yaml", () => {
    const profile = parseProfile(realYaml);
    expect(profile.basics.name).toBe("Talha Ibne Imam");
    expect(profile.experience.length).toBeGreaterThan(0);
  });

  it("treats basics.name_arabic as optional (Mirage calligraphy)", () => {
    expect(parseProfile(realYaml).basics.name_arabic).toBe("طلحة ابن إمام");
    const profile = parseProfile(mutate((d) => delete d.basics.name_arabic));
    expect(profile.basics.name_arabic).toBeUndefined();
  });

  it("names the path of a missing required field", () => {
    const issues = issuesOf(mutate((d) => delete d.experience[1].role));
    expect(issues).toContain("experience[1].role: required field is missing");
  });

  it("names the path of an invalid date", () => {
    const issues = issuesOf(mutate((d) => (d.experience[1].start = "2021-13")));
    expect(issues).toContain("experience[1].start: expected YYYY-MM");
  });

  it("rejects an invalid end date", () => {
    const issues = issuesOf(mutate((d) => (d.products[0].end = "now")));
    expect(issues.some((i) => i.startsWith("products[0].end:"))).toBe(true);
  });

  it("rejects an email address anywhere", () => {
    const issues = issuesOf(mutate((d) => (d.basics.summary = "Mail me at talha@example.com")));
    expect(issues).toContain(
      "basics.summary: must not contain an email address (the file is public)",
    );
  });

  it("rejects a phone number, including in twin notes", () => {
    const issues = issuesOf(
      mutate((d) => (d.twin_notes.interests = "WhatsApp me on +880 1712 345678")),
    );
    expect(issues).toContain(
      "twin_notes.interests: must not contain a phone number (the file is public)",
    );
  });

  it("reports unknown keys (typos)", () => {
    const issues = issuesOf(mutate((d) => (d.experience[0].hightlights = ["x"])));
    expect(issues).toContain("experience[0].hightlights: unknown field (typo?)");
  });

  it("reports YAML syntax errors", () => {
    expect(issuesOf("basics: [unclosed")[0]).toMatch(/^YAML syntax error/);
  });
});
