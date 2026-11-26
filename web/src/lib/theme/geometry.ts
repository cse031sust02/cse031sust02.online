/** Pure geometry for the Mirage theme's Islamic-pattern SVGs (stars, rosettes, sky). */

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Points of a star polygon with `points` tips: tips on radius `outer`, notches on `inner`.
 * An 8-point star with inner = outer × 0.7654 is the classic khatam (two overlapping squares).
 */
export function starPoints(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number,
  rotationDeg = -90,
): string {
  const out: string[] = [];
  const step = Math.PI / points;
  const rot = (rotationDeg * Math.PI) / 180;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rot + i * step;
    out.push(`${round(cx + r * Math.cos(a))},${round(cy + r * Math.sin(a))}`);
  }
  return out.join(" ");
}

/** Inner radius that makes an {n/2} star whose edges line up like two overlapping squares. */
export const KHATAM_RATIO = Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);

/** Small deterministic PRNG (mulberry32) so server and client render identical skies. */
export function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export type Star = { x: number; y: number; r: number; delay: number };

/** `count` stars inside the box, deterministic for a given seed. */
export function starField(
  count: number,
  box: { x: number; y: number; width: number; height: number },
  seed = 7,
): Star[] {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: round(box.x + rand() * box.width),
    y: round(box.y + rand() * box.height),
    r: round(0.4 + rand() * 1.2),
    delay: round(rand() * 6),
  }));
}
