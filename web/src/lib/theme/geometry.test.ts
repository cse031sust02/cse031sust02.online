import { describe, expect, it } from "vitest";
import { KHATAM_RATIO, seededRandom, starField, starPoints } from "./geometry";

describe("starPoints", () => {
  it("returns 2 × points vertices", () => {
    expect(starPoints(0, 0, 10, 5, 8).split(" ")).toHaveLength(16);
  });

  it("puts the first tip straight up by default", () => {
    expect(starPoints(50, 50, 10, 5, 8).split(" ")[0]).toBe("50,40");
  });

  it("alternates tip and notch radii", () => {
    const [tip, notch] = starPoints(0, 0, 10, 4, 6, 0)
      .split(" ")
      .map((p) => p.split(",").map(Number))
      .map(([x, y]) => Math.hypot(x, y));
    expect(tip).toBeCloseTo(10, 1);
    expect(notch).toBeCloseTo(4, 1);
  });

  it("khatam ratio is about 0.765", () => {
    expect(KHATAM_RATIO).toBeCloseTo(0.7654, 3);
  });
});

describe("seeded sky", () => {
  it("is deterministic per seed (no hydration mismatch)", () => {
    const box = { x: 0, y: 0, width: 100, height: 50 };
    expect(starField(20, box, 3)).toEqual(starField(20, box, 3));
    expect(starField(20, box, 3)).not.toEqual(starField(20, box, 4));
  });

  it("keeps stars inside the box", () => {
    const box = { x: 10, y: 20, width: 100, height: 50 };
    for (const s of starField(50, box)) {
      expect(s.x).toBeGreaterThanOrEqual(10);
      expect(s.x).toBeLessThanOrEqual(110);
      expect(s.y).toBeGreaterThanOrEqual(20);
      expect(s.y).toBeLessThanOrEqual(70);
    }
  });

  it("produces values in [0, 1)", () => {
    const r = seededRandom(1);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
