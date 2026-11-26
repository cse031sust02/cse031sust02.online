"use client";

import { useEffect, useRef, useState } from "react";
import { disclaimer } from "@/lib/twin/disclaimer";
import { Markdown } from "./Markdown";
import { MAX_QUESTION_CHARS, STATUS_TEXT, useTwin } from "./TwinProvider";

type TwinChatProps = { autoFocus?: boolean; className?: string };

export function TwinChat({ autoFocus = false, className = "" }: TwinChatProps) {
  const { messages, status, prompts, send, reset, ownerName } = useTwin();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const streaming = status === "streaming";

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const submit = (text: string) => {
    if (!text.trim() || streaming) return;
    setDraft("");
    void send(text);
  };

  const notice = status !== "idle" && status !== "streaming" ? STATUS_TEXT[status] : null;

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      <p className="border-b border-border px-4 py-2 text-xs text-muted">{disclaimer(ownerName)}</p>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the digital twin"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm"
      >
        {messages.length === 0 && (
          <div>
            <p className="mb-3 font-mono text-muted">
              <span className="text-accent">twin@talhaos</span>:~$ ask me anything about my work
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
              {prompts.map((prompt) => (
                <li key={prompt}>
                  <button
                    type="button"
                    onClick={() => submit(prompt)}
                    className="rounded-chip border border-border px-3 py-1.5 text-left font-mono text-xs text-fg hover:border-accent hover:text-accent"
                  >
                    {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          return m.role === "user" ? (
            <div key={i} className="ml-8 rounded-chip bg-surface-2 px-3 py-2 font-mono text-fg">
              <span className="sr-only">You: </span>
              <span aria-hidden="true" className="text-accent-2">
                &gt;{" "}
              </span>
              {m.content}
            </div>
          ) : (
            <div key={i} className="mr-4 text-fg" data-testid="twin-reply">
              <span className="sr-only">Twin: </span>
              <Markdown text={m.content} />
              {isLast && streaming && (
                <span aria-hidden="true" className="cursor-blink text-accent">
                  ▋
                </span>
              )}
            </div>
          );
        })}
      </div>

      {notice && (
        <p
          role="status"
          className="mx-4 mb-2 rounded-chip border border-highlight/50 px-3 py-2 font-mono text-xs text-highlight"
        >
          {notice}
        </p>
      )}

      <form
        className="flex items-end gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <label htmlFor="twin-input" className="sr-only">
          Ask the twin a question
        </label>
        <textarea
          ref={inputRef}
          id="twin-input"
          rows={1}
          maxLength={MAX_QUESTION_CHARS}
          value={draft}
          placeholder="Ask about experience, products, leadership…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(draft);
            }
          }}
          className="max-h-32 min-h-10 flex-1 resize-none rounded-chip border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={streaming || !draft.trim()}
          className="rounded-chip border border-accent bg-accent px-3 py-2 font-mono text-sm text-bg disabled:opacity-50"
        >
          send
        </button>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            disabled={streaming}
            className="rounded-chip border border-border px-3 py-2 font-mono text-sm text-muted hover:text-fg"
          >
            clear
          </button>
        )}
      </form>
    </div>
  );
}
