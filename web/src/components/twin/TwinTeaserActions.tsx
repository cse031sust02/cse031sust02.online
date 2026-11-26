"use client";

import Link from "next/link";
import { useTwin } from "./TwinProvider";

/** Home-page twin teaser: suggested prompts open the slide-over chat. */
export function TwinTeaserActions() {
  const { prompts, openWith, setOpen } = useTwin();
  return (
    <>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
        {prompts.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => openWith(prompt)}
              className="rounded-chip border border-border px-3 py-1.5 text-left font-mono text-xs text-fg hover:border-accent hover:text-accent"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-chip border border-accent bg-accent px-4 py-2 font-mono text-sm text-bg hover:bg-transparent hover:text-accent"
        >
          ./twin --chat
        </button>
        <Link
          href="/twin"
          className="rounded-chip border border-border px-4 py-2 font-mono text-sm text-fg hover:border-accent"
        >
          Open full screen
        </Link>
      </div>
    </>
  );
}
