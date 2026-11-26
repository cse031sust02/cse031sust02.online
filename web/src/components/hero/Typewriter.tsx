"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/nerd/use-reduced-motion";

const CHAR_MS = 35;

/** Types out `text` once. Screen readers get the full text; reduced motion shows it immediately. */
export function Typewriter({ text, className = "" }: { text: string; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (reducedMotion) {
      // Reduced motion: show everything at once.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, CHAR_MS);
    return () => window.clearInterval(id);
  }, [text, reducedMotion]);

  const typing = count < text.length;
  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-testid="typewriter">
        {text.slice(0, count)}
        <span className={`text-accent ${typing ? "" : "cursor-blink"}`}>▋</span>
      </span>
    </p>
  );
}
