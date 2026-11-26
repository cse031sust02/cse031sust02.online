"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { fuzzyFilter } from "@/lib/nerd/fuzzy";
import { useNerd } from "./NerdProvider";
import { type PaletteItem, buildPaletteItems } from "./palette-items";
import { scrollToSection } from "./scroll";

/** ⌘K / Ctrl+K command palette: fuzzy search over sections and commands. */
export function CommandPalette({ links }: { links: { label: string; url: string }[] }) {
  const { paletteOpen, setPaletteOpen } = useNerd();
  if (!paletteOpen) return null;
  return <PaletteDialog links={links} onClose={() => setPaletteOpen(false)} />;
}

function PaletteDialog({
  links,
  onClose,
}: {
  links: { label: string; url: string }[];
  onClose: () => void;
}) {
  const { toggleCrt, toggleMatrix } = useNerd();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const items = useMemo(() => buildPaletteItems(links), [links]);
  const results = useMemo(
    () => fuzzyFilter(items, query, (i) => `${i.label} ${i.hint}`),
    [items, query],
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  const run = (item: PaletteItem) => {
    onClose();
    const { action } = item;
    if (action.type === "scroll") {
      if (!scrollToSection(action.target)) router.push(`/#${action.target}`);
    } else if (action.type === "open") window.open(action.url, "_blank", "noopener,noreferrer");
    else if (action.type === "toggle-crt") toggleCrt();
    else toggleMatrix();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-bg/70 p-4 pt-[15vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-window border border-border bg-surface shadow-glow"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <span aria-hidden="true" className="font-mono text-accent">
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? optionId(active) : undefined}
            aria-label="Search sections and commands"
            placeholder="Type a command or section…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            className="w-full bg-transparent py-3 font-mono text-sm text-fg outline-none placeholder:text-muted"
          />
          <kbd className="font-mono text-xs text-muted">esc</kbd>
        </div>
        <ul
          id={listId}
          role="listbox"
          aria-label="Results"
          className="max-h-80 overflow-y-auto py-2"
        >
          {results.length === 0 && (
            <li className="px-4 py-2 font-mono text-sm text-muted">command not found: {query}</li>
          )}
          {results.map((item, i) => (
            <li
              key={item.id}
              id={optionId(i)}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(item)}
              className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-2 font-mono text-sm ${
                i === active ? "bg-surface-2 text-accent" : "text-fg"
              }`}
            >
              <span>{item.label}</span>
              <span className="truncate text-xs text-muted">{item.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
