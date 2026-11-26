import { describe, expect, it } from "vitest";
import { makeFixtureProfile } from "@/test/fixture-profile";
import { orderPrompts, suggestedPrompts } from "./suggested-prompts";

describe("suggestedPrompts", () => {
  it("pins the first FAQ question", () => {
    const profile = makeFixtureProfile();
    expect(suggestedPrompts(profile).pinned).toEqual([profile.twin_notes.faq[0].q]);
  });

  it("pins nothing when there is no FAQ", () => {
    const base = makeFixtureProfile();
    const profile = makeFixtureProfile({ twin_notes: { ...base.twin_notes, faq: [] } });
    expect(suggestedPrompts(profile).pinned).toEqual([]);
  });

  it("has a pool of 10 questions, including the first product", () => {
    const profile = makeFixtureProfile();
    const { pool } = suggestedPrompts(profile);
    expect(pool).toHaveLength(10);
    expect(new Set(pool).size).toBe(10);
    expect(pool).toContain(`Tell me about ${profile.products[0].name}.`);
  });
});

describe("orderPrompts", () => {
  const set = { pinned: ["Pinned?"], pool: ["A", "B", "C", "D", "E"] };

  it("keeps pinned prompts first and every pool prompt once", () => {
    for (let run = 0; run < 20; run++) {
      const ordered = orderPrompts(set);
      expect(ordered[0]).toBe("Pinned?");
      expect([...ordered.slice(1)].sort()).toEqual(set.pool);
    }
  });

  it("shuffles the pool using the random source", () => {
    expect(orderPrompts(set, () => 0)).toEqual(["Pinned?", "B", "C", "D", "E", "A"]);
    expect(orderPrompts(set, () => 0.999)).toEqual(["Pinned?", "A", "B", "C", "D", "E"]);
  });
});
