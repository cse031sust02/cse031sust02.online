import { describe, expect, it } from "vitest";
import { SlidingWindowRateLimiter, getClientIp } from "./rate-limit";

describe("SlidingWindowRateLimiter", () => {
  it("allows `limit` hits per window, then blocks with Retry-After", () => {
    let now = 0;
    const limiter = new SlidingWindowRateLimiter(3, 10_000, () => now);
    expect([1, 2, 3].map(() => limiter.check("a").allowed)).toEqual([true, true, true]);
    const blocked = limiter.check("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(10);
    expect(limiter.check("b").allowed).toBe(true); // per key

    now = 10_001; // the oldest hit slid out of the window
    expect(limiter.check("a").allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses the first X-Forwarded-For hop", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
  });
  it("falls back to X-Real-IP, then unknown", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
