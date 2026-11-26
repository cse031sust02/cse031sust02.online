"use client";

import { SHOWN_PROMPTS, orderPrompts } from "@/lib/twin/suggested-prompts";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type TwinMessage = { role: "user" | "assistant"; content: string };
export type TwinStatus = "idle" | "streaming" | "offline" | "rate_limited" | "error";

type TwinState = {
  messages: TwinMessage[];
  status: TwinStatus;
  /** Suggested chips for an empty chat: pinned ones first, then random picks. */
  prompts: string[];
  /** Owner's first name, for UI copy. */
  ownerName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Chat window size: side panel (false) or large centered window (true). */
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  /** Sends a question; resolves with the full reply (or a status message). */
  send: (question: string) => Promise<string>;
  /** Opens the slide-over and sends a question. */
  openWith: (question: string) => void;
  reset: () => void;
};

const STORAGE_KEY = "cse031sust02:twin";
export const MAX_QUESTION_CHARS = 1000;
const MAX_STORED_MESSAGES = 50;

export const STATUS_TEXT: Record<Exclude<TwinStatus, "idle" | "streaming">, string> = {
  offline: "agent offline: the AI agent isn't available right now. Please use the contact form.",
  rate_limited: "Too many messages in a short time. Please wait a few minutes and try again.",
  error: "Something went wrong. Please try again.",
};

const TwinContext = createContext<TwinState | null>(null);
const NO_PROMPTS: string[] = [];

export function useTwin(): TwinState {
  const ctx = useContext(TwinContext);
  if (!ctx) throw new Error("useTwin must be used inside <TwinProvider>");
  return ctx;
}

export function useTwinOptional(): TwinState | null {
  return useContext(TwinContext);
}

/** Shared twin conversation (launcher, /twin, home teaser, terminal). Lives in sessionStorage only. */
export function TwinProvider({
  prompts: pool,
  pinnedPrompts,
  ownerName,
  children,
}: {
  /** Pool of suggested questions; a random few are shown. */
  prompts: string[];
  /** Questions always shown first (e.g. the brand FAQ). */
  pinnedPrompts?: string[];
  ownerName: string;
  children: ReactNode;
}) {
  const pinned = pinnedPrompts ?? NO_PROMPTS;
  // Server render uses a fixed order; the shuffle happens after hydration to avoid a mismatch.
  const [ordered, setOrdered] = useState<string[]>(() => [...pinned, ...pool]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdered(orderPrompts({ pinned, pool }));
  }, [pinned, pool]);
  const prompts = useMemo(() => ordered.slice(0, SHOWN_PROMPTS), [ordered]);
  const [messages, setMessages] = useState<TwinMessage[]>([]);
  const [status, setStatus] = useState<TwinStatus>("idle");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesRef = useRef<TwinMessage[]>([]);
  const busy = useRef(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored) && stored.length) {
        messagesRef.current = stored;
        // Client-only data restored after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages(stored);
      }
    } catch {
      /* ignore corrupt or unavailable storage */
    }
  }, []);

  const update = useCallback((next: TwinMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(-MAX_STORED_MESSAGES)));
    } catch {
      /* ignore */
    }
  }, []);

  const send = useCallback(
    async (rawQuestion: string): Promise<string> => {
      const question = rawQuestion.trim().slice(0, MAX_QUESTION_CHARS);
      if (!question || busy.current) return "";
      busy.current = true;
      setStatus("streaming");

      const history = [...messagesRef.current, { role: "user" as const, content: question }];
      update([...history, { role: "assistant", content: "" }]);

      const fail = (next: Exclude<TwinStatus, "idle" | "streaming">) => {
        update(history);
        setStatus(next);
        return STATUS_TEXT[next];
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.filter((m) => m.content.trim()).slice(-50) }),
        });
        if (res.status === 429) return fail("rate_limited");
        if (res.status === 503) return fail("offline");
        if (!res.ok || !res.body) return fail("error");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          update([...history, { role: "assistant", content: reply }]);
        }
        reply += decoder.decode();
        if (!reply.trim()) return fail("offline");
        update([...history, { role: "assistant", content: reply }]);
        setStatus("idle");
        return reply;
      } catch {
        return fail("error");
      } finally {
        busy.current = false;
      }
    },
    [update],
  );

  const openWith = useCallback(
    (question: string) => {
      setOpen(true);
      void send(question);
    },
    [send],
  );

  const reset = useCallback(() => {
    update([]);
    setStatus("idle");
  }, [update]);

  const value = useMemo(
    () => ({
      messages,
      status,
      prompts,
      ownerName,
      open,
      setOpen,
      expanded,
      setExpanded,
      send,
      openWith,
      reset,
    }),
    [messages, status, prompts, ownerName, open, expanded, send, openWith, reset],
  );
  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>;
}
