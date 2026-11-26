import { describe, expect, it } from "vitest";
import { renderAscii } from "./ascii-font";

describe("renderAscii", () => {
  it("renders 5 equal-width rows of block letters", () => {
    const rows = renderAscii("Talha").split("\n");
    expect(rows).toHaveLength(5);
    expect(new Set(rows.map((r) => r.length)).size).toBe(1);
    expect(rows[0]).toContain("█");
    expect(rows[0]).toHaveLength(5 * 5 + 4);
  });
  it("skips unsupported characters", () => {
    expect(renderAscii("A!")).toBe(renderAscii("A"));
    expect(renderAscii("123")).toBe("");
  });
});
