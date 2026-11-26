import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, THEMES, isThemeId, nextTheme, themeLabel } from "./themes";

describe("themes", () => {
  it("has two distinct themes with terminal as the default", () => {
    expect(THEMES.map((t) => t.id)).toEqual(["terminal", "mirage"]);
    expect(DEFAULT_THEME).toBe("terminal");
  });

  it("validates theme ids", () => {
    expect(isThemeId("mirage")).toBe(true);
    expect(isThemeId("terminal")).toBe(true);
    expect(isThemeId("neon")).toBe(false);
    expect(isThemeId(null)).toBe(false);
  });

  it("cycles through themes and wraps around", () => {
    expect(nextTheme("terminal")).toBe("mirage");
    expect(nextTheme("mirage")).toBe("terminal");
  });

  it("labels themes", () => {
    expect(themeLabel("mirage")).toBe("Mirage");
  });
});
