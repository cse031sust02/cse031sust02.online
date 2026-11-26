import { describe, expect, it } from "vitest";
import { fuzzyFilter, fuzzyScore } from "./fuzzy";

describe("fuzzy", () => {
  it("matches subsequences and rejects non-matches", () => {
    expect(fuzzyScore("exp", "Experience")).not.toBeNull();
    expect(fuzzyScore("xpr", "Experience")).not.toBeNull();
    expect(fuzzyScore("zzz", "Experience")).toBeNull();
  });

  it("ranks prefix and consecutive matches first", () => {
    const items = ["Open GitHub", "Products", "Go to Experience"];
    expect(fuzzyFilter(items, "pro", (s) => s)[0]).toBe("Products");
    expect(fuzzyFilter(items, "git", (s) => s)[0]).toBe("Open GitHub");
  });

  it("keeps order for an empty query", () => {
    expect(fuzzyFilter(["b", "a"], "  ", (s) => s)).toEqual(["b", "a"]);
  });
});
