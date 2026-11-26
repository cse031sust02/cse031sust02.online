import { describe, expect, it } from "vitest";
import { formatDate, formatDateRange } from "./dates";

describe("formatDateRange", () => {
  it("formats YYYY-MM ranges", () => {
    expect(formatDateRange("2021-01", "2026-08")).toBe("Jan 2021 – Aug 2026");
  });
  it("formats present", () => {
    expect(formatDateRange("2021-01", "present")).toBe("Jan 2021 – Present");
  });
  it("formats year ranges and a missing start", () => {
    expect(formatDateRange(2011, 2014)).toBe("2011 – 2014");
    expect(formatDateRange(undefined, 2002)).toBe("2002");
  });
  it("formats single dates", () => {
    expect(formatDate("2020-12")).toBe("Dec 2020");
  });
});
