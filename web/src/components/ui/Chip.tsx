import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-chip border border-border bg-surface-2 px-2 py-0.5 font-mono text-xs text-accent-2">
      {children}
    </li>
  );
}

export function ChipList({ items, label }: { items: readonly string[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </ul>
  );
}
