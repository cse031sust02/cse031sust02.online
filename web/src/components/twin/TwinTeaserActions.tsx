"use client";

import { AgentAvatar, StatusDot } from "./AgentAvatar";
import { useTwin } from "./TwinProvider";

/** Home-page twin teaser: an agent greeting; suggested prompts open the slide-over chat. */
export function TwinTeaserActions() {
  const { prompts, openWith, setOpen, setExpanded, ownerName, status } = useTwin();
  const agentName = `${ownerName}'s AI Agent`;
  return (
    <div className="mt-6 rounded-window border border-border bg-bg p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <AgentAvatar size={40} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 font-mono text-sm font-bold text-fg">
            {agentName}
            <span className="flex items-center gap-1.5 text-xs font-normal text-muted">
              <StatusDot tone={status === "offline" ? "offline" : "online"} />
              {status === "offline" ? "offline" : "online"}
            </span>
          </p>
          <p className="mt-2 rounded-2xl rounded-tl-sm border border-border bg-surface-2 px-3.5 py-2 text-sm text-fg">
            Hi! I&apos;m an AI agent trained only on {ownerName}&apos;s CV. Pick a question or ask
            your own.
          </p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2 sm:pl-[52px]" aria-label="Suggested questions">
        {prompts.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => openWith(prompt)}
              className="rounded-full border border-accent/40 px-3 py-1.5 text-left text-xs text-accent hover:bg-accent hover:text-bg"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-3 sm:pl-[52px]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-chip border border-accent bg-accent px-4 py-2 font-mono text-sm text-bg hover:bg-transparent hover:text-accent"
        >
          Start a chat
        </button>
        <button
          type="button"
          onClick={() => {
            setExpanded(true);
            setOpen(true);
          }}
          className="rounded-chip border border-border px-4 py-2 font-mono text-sm text-fg hover:border-accent"
        >
          Open full screen
        </button>
      </div>
    </div>
  );
}
