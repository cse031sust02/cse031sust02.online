"use client";

import { useId, useState } from "react";
import type { Experience } from "@/lib/content/schema";
import { ChipList } from "@/components/ui/Chip";

type ExperienceItemProps = {
  entry: Experience;
  hash: string;
  dateRange: string;
  isHead: boolean;
  defaultOpen?: boolean;
};

/** One "commit" in the career log. The toggle is a native button, so Enter/Space work. */
export function ExperienceItem({
  entry,
  hash,
  dateRange,
  isHead,
  defaultOpen = false,
}: ExperienceItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <li className="relative border-l border-border pb-6 pl-6 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent shadow-glow"
      />
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="group w-full text-left"
      >
        <span className="block font-mono text-xs text-muted">
          <span className="text-highlight">commit {hash}</span>
          {isHead && <span className="text-accent-2"> (HEAD -&gt; career)</span>}
          <span aria-hidden="true" className="ml-2 text-accent">
            {open ? "[−]" : "[+]"}
          </span>
        </span>
        <span className="mt-1 block text-lg font-semibold text-fg group-hover:text-accent">
          {entry.role} <span className="text-muted">@</span> {entry.company}
        </span>
        <span className="block font-mono text-sm text-muted">{dateRange}</span>
      </button>
      <div id={panelId} hidden={!open} className="mt-3 space-y-3">
        <ul className="list-disc space-y-1.5 pl-5 text-fg marker:text-accent">
          {entry.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ChipList items={entry.tech} label={`Tech used at ${entry.company}`} />
      </div>
    </li>
  );
}
