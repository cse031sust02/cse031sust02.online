import { describe, expect, it } from "vitest";
import { KONAMI_SEQUENCE, createKonamiMatcher } from "./konami";

describe("konami matcher", () => {
  it("fires only on the full sequence", () => {
    const match = createKonamiMatcher();
    const results = KONAMI_SEQUENCE.map((k) => match(k));
    expect(results.slice(0, -1).every((r) => r === false)).toBe(true);
    expect(results.at(-1)).toBe(true);
  });

  it("resets on a wrong key and tolerates an extra leading ArrowUp", () => {
    const match = createKonamiMatcher();
    match("ArrowUp");
    match("x");
    expect(KONAMI_SEQUENCE.map((k) => match(k)).at(-1)).toBe(true);
    const again = createKonamiMatcher();
    expect(["ArrowUp", ...KONAMI_SEQUENCE].map((k) => again(k)).at(-1)).toBe(false);
  });

  it("accepts uppercase B/A", () => {
    const match = createKonamiMatcher();
    const keys = [...KONAMI_SEQUENCE.slice(0, 8), "B", "A"];
    expect(keys.map((k) => match(k)).at(-1)).toBe(true);
  });
});
