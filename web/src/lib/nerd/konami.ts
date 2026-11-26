export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/** Returns a key handler that reports true when the Konami code has just been completed. */
export function createKonamiMatcher(sequence: readonly string[] = KONAMI_SEQUENCE) {
  let position = 0;
  return (key: string): boolean => {
    const k = key.length === 1 ? key.toLowerCase() : key;
    if (k === sequence[position]) {
      position++;
      if (position === sequence.length) {
        position = 0;
        return true;
      }
      return false;
    }
    position = k === sequence[0] ? 1 : 0;
    return false;
  };
}
