/** Immutable shell history with ↑/↓ navigation. `index === entries.length` means "new line". */
export type History = { entries: string[]; index: number };

export const emptyHistory: History = { entries: [], index: 0 };

export function pushHistory(h: History, command: string): History {
  const cmd = command.trim();
  if (cmd === "") return { ...h, index: h.entries.length };
  const entries = h.entries.at(-1) === cmd ? h.entries : [...h.entries, cmd];
  return { entries, index: entries.length };
}

/** ↑: older entry. Returns the new state and the text to show. */
export function historyUp(h: History): { history: History; value: string | undefined } {
  if (h.entries.length === 0) return { history: h, value: undefined };
  const index = Math.max(0, h.index - 1);
  return { history: { ...h, index }, value: h.entries[index] };
}

/** ↓: newer entry; past the newest returns an empty line. */
export function historyDown(h: History): { history: History; value: string } {
  const index = Math.min(h.entries.length, h.index + 1);
  return { history: { ...h, index }, value: h.entries[index] ?? "" };
}
