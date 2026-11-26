import { describe, expect, it } from "vitest";
import { containsEmail, containsPhone } from "./privacy";

describe("privacy guard", () => {
  it.each(["me@example.com", "write to first.last+tag@mail.co.uk please"])(
    "detects email in %s",
    (value) => expect(containsEmail(value)).toBe(true),
  );

  it.each(["+880 1712 345678", "+8801712345678", "(555) 123-4567", "call 017-1234-5678 now"])(
    "detects phone in %s",
    (value) => expect(containsPhone(value)).toBe(true),
  );

  it.each([
    "2003-2008",
    "10–12 engineers",
    "15+ years",
    "https://app.pluralsight.com/achievements/share/c1eccf28-4809-46d1-8975-fc49f59737d7",
    "UC-M313Z1W1",
    "Jan 2021 – Aug 2026",
  ])("does not flag %s", (value) => {
    expect(containsEmail(value)).toBe(false);
    expect(containsPhone(value)).toBe(false);
  });
});
