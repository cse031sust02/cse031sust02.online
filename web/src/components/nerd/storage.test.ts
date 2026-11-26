import { afterEach, describe, expect, it } from "vitest";
import { PREPAINT_SCRIPT, THEME_KEY } from "./storage";

function runPrepaint(stored: Record<string, string>) {
  localStorage.clear();
  for (const [k, v] of Object.entries(stored)) localStorage.setItem(k, v);
  delete document.documentElement.dataset.theme;
  window.matchMedia ??= (() => ({ matches: false })) as unknown as typeof window.matchMedia;
  new Function(PREPAINT_SCRIPT)();
  return document.documentElement.dataset.theme;
}

describe("pre-paint script: theme", () => {
  afterEach(() => localStorage.clear());

  it("applies a stored non-default theme", () => {
    expect(runPrepaint({ [THEME_KEY]: "mirage" })).toBe("mirage");
  });

  it("leaves the default theme as no attribute", () => {
    expect(runPrepaint({ [THEME_KEY]: "terminal" })).toBeUndefined();
    expect(runPrepaint({})).toBeUndefined();
  });

  it("ignores unknown values", () => {
    expect(runPrepaint({ [THEME_KEY]: "neon" })).toBeUndefined();
  });
});
