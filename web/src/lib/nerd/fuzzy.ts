/**
 * Small subsequence fuzzy matcher for the command palette.
 * Returns a score (higher is better), or null when `query` isn't a subsequence of `text`.
 */
export function fuzzyScore(query: string, text: string): number | null {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (q.length === 0) return 0;

  let score = 0;
  let ti = 0;
  let prev = -2;
  for (const ch of q) {
    if (ch === " ") continue;
    const found = t.indexOf(ch, ti);
    if (found === -1) return null;
    score += 1;
    if (found === prev + 1) score += 3; // consecutive
    if (found === 0 || /[\s/\-_.]/.test(t[found - 1] ?? "")) score += 2; // word start
    prev = found;
    ti = found + 1;
  }
  if (t.startsWith(q)) score += 5;
  return score - t.length * 0.01; // prefer shorter labels on ties
}

/** Filters and ranks items; with an empty query, keeps the original order. */
export function fuzzyFilter<T>(
  items: readonly T[],
  query: string,
  toText: (item: T) => string,
): T[] {
  if (query.trim() === "") return [...items];
  return items
    .map((item) => ({ item, score: fuzzyScore(query, toText(item)) }))
    .filter((x): x is { item: T; score: number } => x.score !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}
