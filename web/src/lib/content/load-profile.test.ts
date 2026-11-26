// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getProfile } from "./load-profile";

describe("getProfile", () => {
  it("loads and caches the profile", () => {
    const first = getProfile();
    expect(first.basics.handle).toBe("cse031sust02");
    expect(getProfile()).toBe(first);
  });

  it("is marked server-only so client components cannot import it", () => {
    const source = readFileSync(path.join(__dirname, "load-profile.ts"), "utf8");
    expect(source.split("\n")[0]).toBe('import "server-only";');
  });
});
