"use client";

import { useEffect, useRef, useState } from "react";
import { useNerdOptional } from "@/components/nerd/NerdProvider";
import { scrollToSection } from "@/components/nerd/scroll";
import { useTwinOptional } from "@/components/twin/TwinProvider";
import { type TerminalAction, runCommand } from "@/lib/terminal/commands";
import type { TerminalData } from "@/lib/terminal/data";
import { emptyHistory, historyDown, historyUp, pushHistory } from "@/lib/terminal/history";

type Entry = { id: number; kind: "input" | "output"; text: string };

type TerminalProps = {
  data: TerminalData;
  prompt: string;
  /** Handles `twin <question>`; defaults to the shared twin conversation. */
  onTwin?: (question: string) => Promise<string> | string;
};

const WELCOME = "Welcome to cse031sust02. Type 'help' to get started.";

export function Terminal({ data, prompt, onTwin }: TerminalProps) {
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, kind: "output", text: WELCOME }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState(emptyHistory);
  const twin = useTwinOptional();
  const nerd = useNerdOptional();
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries]);

  const append = (kind: Entry["kind"], lines: string[]) =>
    setEntries((prev) => [...prev, ...lines.map((text) => ({ id: nextId.current++, kind, text }))]);

  const handleAction = async (action: TerminalAction) => {
    if (action.type === "clear") setEntries([]);
    else if (action.type === "scroll") scrollToSection(action.target);
    else if (action.type === "theme") nerd?.setTheme(action.theme);
    else {
      const ask = onTwin ?? twin?.send;
      if (!ask) {
        append("output", ["agent: offline for now. Try again soon, or use the contact form."]);
        return;
      }
      append("output", ["agent: thinking…"]);
      const reply = (await ask(action.question)) || "agent: no answer.";
      append(
        "output",
        reply.split("\n").map((l) => (l ? `agent> ${l}` : "")),
      );
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = value;
    setValue("");
    setHistory((h) => pushHistory(h, input));
    append("input", [input]);
    const result = runCommand(input, data);
    if (result.lines.length) append("output", result.lines);
    if (result.action) void handleAction(result.action);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const r = historyUp(history);
      setHistory(r.history);
      if (r.value !== undefined) setValue(r.value);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const r = historyDown(history);
      setHistory(r.history);
      setValue(r.value);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div
      className="rounded-chip border border-border bg-bg p-4 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="max-h-80 overflow-y-auto whitespace-pre-wrap break-words"
      >
        {entries.map((entry) =>
          entry.kind === "input" ? (
            <p key={entry.id}>
              <span className="text-accent">{prompt}</span> {entry.text}
            </p>
          ) : (
            <p key={entry.id} className="text-fg">
              {entry.text}
            </p>
          ),
        )}
      </div>
      <form onSubmit={submit} className="mt-2 flex items-center gap-2">
        <label htmlFor="terminal-input" className="shrink-0 text-accent">
          {prompt}
          <span className="sr-only"> Terminal command</span>
        </label>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none"
        />
      </form>
    </div>
  );
}
