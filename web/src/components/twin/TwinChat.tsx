"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { disclaimer } from "@/lib/twin/disclaimer";
import { AgentAvatar, StatusDot } from "./AgentAvatar";
import { Markdown } from "./Markdown";
import { MAX_QUESTION_CHARS, STATUS_TEXT, type TwinStatus, useTwin } from "./TwinProvider";

type TwinChatProps = {
  autoFocus?: boolean;
  className?: string;
  /** Extra controls for the header (e.g. full screen / close in the slide-over). */
  actions?: ReactNode;
};

function agentState(status: TwinStatus, waitingForFirstToken: boolean) {
  if (status === "offline") return { tone: "offline" as const, label: "offline" };
  if (status === "streaming")
    return { tone: "busy" as const, label: waitingForFirstToken ? "thinking…" : "typing…" };
  return { tone: "online" as const, label: "online · answers from my CV" };
}

export function TwinChat({ autoFocus = false, className = "", actions }: TwinChatProps) {
  const { messages, status, prompts, send, reset, ownerName } = useTwin();
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const streaming = status === "streaming";
  const last = messages.at(-1);
  const waitingForFirstToken = streaming && last?.role === "assistant" && last.content === "";
  const state = agentState(status, waitingForFirstToken);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, status]);

  const submit = (text: string) => {
    if (!text.trim() || streaming) return;
    setDraft("");
    void send(text);
    inputRef.current?.focus();
  };

  const copy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      window.setTimeout(() => setCopied((c) => (c === index ? null : c)), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const followUps = prompts.filter((p) => !asked.has(p)).slice(0, 3);
  const showFollowUps = !streaming && last?.role === "assistant" && last.content !== "";
  const notice = status !== "idle" && status !== "streaming" ? STATUS_TEXT[status] : null;
  const agentName = `${ownerName}'s AI Twin`;

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      {/* Agent identity */}
      <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-4 py-3">
        <AgentAvatar size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-bold text-fg">{agentName}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted" data-testid="agent-status">
            <StatusDot tone={state.tone} />
            {state.label}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            disabled={streaming}
            className="rounded-chip px-2 py-1 font-mono text-xs text-muted hover:text-fg disabled:opacity-50"
          >
            new chat
          </button>
        )}
        {actions}
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the digital twin"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm"
      >
        {/* Greeting */}
        <AgentBubble>
          <p>
            Hi! I&apos;m {agentName}, an AI agent trained only on {ownerName}&apos;s CV. Ask me
            about experience, products, skills or how I lead teams.
          </p>
        </AgentBubble>
        {messages.length === 0 && (
          <PromptChips prompts={prompts} onPick={submit} label="Suggested questions" />
        )}

        {messages.map((m, i) => {
          if (m.role === "user") {
            return (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 whitespace-pre-wrap text-bg">
                  <span className="sr-only">You: </span>
                  {m.content}
                </p>
              </div>
            );
          }
          const isLast = i === messages.length - 1;
          if (isLast && waitingForFirstToken) {
            return (
              <AgentBubble key={i}>
                <span className="flex items-center gap-1 py-1" data-testid="twin-thinking">
                  <span className="sr-only">The twin is thinking</span>
                  <span aria-hidden="true" className="typing-dot" />
                  <span aria-hidden="true" className="typing-dot [animation-delay:150ms]" />
                  <span aria-hidden="true" className="typing-dot [animation-delay:300ms]" />
                </span>
              </AgentBubble>
            );
          }
          return (
            <AgentBubble
              key={i}
              footer={
                !(isLast && streaming) && (
                  <button
                    type="button"
                    onClick={() => copy(m.content, i)}
                    className="font-mono text-[11px] text-muted hover:text-accent"
                  >
                    {copied === i ? "copied ✓" : "copy"}
                    <span className="sr-only"> reply</span>
                  </button>
                )
              }
            >
              <div data-testid="twin-reply">
                <span className="sr-only">Twin: </span>
                <Markdown text={m.content} />
                {isLast && streaming && (
                  <span aria-hidden="true" className="cursor-blink text-accent">
                    ▋
                  </span>
                )}
              </div>
            </AgentBubble>
          );
        })}

        {showFollowUps && followUps.length > 0 && (
          <PromptChips prompts={followUps} onPick={submit} label="Follow-up suggestions" />
        )}
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
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-bg p-1.5 pl-3 focus-within:border-accent focus-within:shadow-glow">
          <label htmlFor="twin-input" className="sr-only">
            Ask the twin a question
          </label>
          <textarea
            ref={inputRef}
            id="twin-input"
            rows={1}
            maxLength={MAX_QUESTION_CHARS}
            value={draft}
            placeholder={`Message ${agentName}…`}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(draft);
              }
            }}
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm text-fg outline-none focus-visible:outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={streaming || !draft.trim()}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-40"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">send</span>
          </button>
        </div>
        <p className="mt-1.5 flex justify-between gap-2 px-1 text-[11px] text-muted">
          <span>{disclaimer(ownerName)}</span>
          <span className="shrink-0 font-mono">
            {draft.length > MAX_QUESTION_CHARS * 0.8
              ? `${draft.length}/${MAX_QUESTION_CHARS}`
              : "↵ send · ⇧↵ newline"}
          </span>
        </p>
      </form>
    </div>
  );
}

function AgentBubble({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <AgentAvatar size={26} className="mt-0.5" />
      <div className="max-w-[88%]">
        <div className="rounded-2xl rounded-tl-sm border border-border bg-surface-2 px-3.5 py-2 text-fg">
          {children}
        </div>
        {footer && <div className="mt-1 pl-1">{footer}</div>}
      </div>
    </div>
  );
}

function PromptChips({
  prompts,
  onPick,
  label,
}: {
  prompts: string[];
  onPick: (prompt: string) => void;
  label: string;
}) {
  return (
    <ul className="flex flex-wrap gap-2 pl-8" aria-label={label}>
      {prompts.map((prompt) => (
        <li key={prompt}>
          <button
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-full border border-accent/40 px-3 py-1.5 text-left text-xs text-accent hover:bg-accent hover:text-bg"
          >
            {prompt}
          </button>
        </li>
      ))}
    </ul>
  );
}
