/** Rate limiting behind a small interface, so the in-memory version can be swapped for Redis. */
export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number; remaining: number };

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

/** Sliding-window log limiter (per process). `limit` hits per `windowMs` per key. */
export class SlidingWindowRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  check(key: string): RateLimitResult {
    const now = this.now();
    const windowStart = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((t) => t > windowStart);

    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      const retryAfterMs = recent[0] + this.windowMs - now;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
        remaining: 0,
      };
    }
    recent.push(now);
    this.hits.set(key, recent);
    this.prune(windowStart);
    return { allowed: true, retryAfterSeconds: 0, remaining: this.limit - recent.length };
  }

  /** Keeps memory bounded: drop keys with no recent hits. */
  private prune(windowStart: number) {
    if (this.hits.size < 5000) return;
    for (const [key, times] of this.hits) {
      if (times.every((t) => t <= windowStart)) this.hits.delete(key);
    }
  }
}

/** Client IP: first hop of X-Forwarded-For, then X-Real-IP, else "unknown". */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;
  return headers.get("x-real-ip")?.trim() || "unknown";
}
