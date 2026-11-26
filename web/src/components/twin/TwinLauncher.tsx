"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AgentAvatar, StatusDot } from "./AgentAvatar";
import { TwinChat } from "./TwinChat";
import { useTwin } from "./TwinProvider";

/** Floating launcher on every page (except /twin) → slide-over chat that can maximize to a large window. */
export function TwinLauncher() {
  const { open, setOpen, expanded, setExpanded, ownerName, status } = useTwin();
  const pathname = usePathname();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) launcherRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, setExpanded]);

  if (pathname === "/twin") return null;

  const close = () => {
    setOpen(false);
    setExpanded(false);
  };

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group fixed right-4 bottom-4 z-50 flex items-center gap-2.5 rounded-full border border-accent/60 bg-surface py-1.5 pr-4 pl-1.5 text-sm text-fg shadow-glow transition-colors hover:border-accent"
        >
          <span className="relative">
            <AgentAvatar size={36} />
            <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-surface p-0.5">
              <StatusDot tone={status === "offline" ? "offline" : "online"} />
            </span>
          </span>
          <span className="font-medium group-hover:text-accent">
            Ask {ownerName}&apos;s AI Agent
          </span>
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-[85]">
          <div
            aria-hidden="true"
            className={`absolute inset-0 ${expanded ? "bg-bg/80 backdrop-blur-sm" : "bg-bg/60"}`}
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chat with my AI agent"
            data-expanded={expanded}
            className={
              expanded
                ? "absolute inset-0 m-auto flex h-dvh w-full flex-col bg-surface shadow-glow sm:h-[min(90dvh,960px)] sm:max-w-4xl sm:overflow-hidden sm:rounded-window sm:border sm:border-border"
                : "absolute top-0 right-0 flex h-dvh w-full max-w-md flex-col border-l border-border bg-surface shadow-glow"
            }
          >
            <TwinChat
              autoFocus
              className="flex-1"
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="rounded-chip p-1.5 text-muted hover:text-accent"
                    title={expanded ? "Minimize" : "Maximize"}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path
                        d={
                          expanded
                            ? "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
                            : "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="sr-only">{expanded ? "Minimize chat" : "Maximize chat"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-chip p-1.5 text-muted hover:text-fg"
                    title="Close"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="sr-only">Close chat</span>
                  </button>
                </>
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
