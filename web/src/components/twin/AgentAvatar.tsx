/** The AI agent's avatar: a glowing sparkle mark (decorative, deliberately not a face). */
export function AgentAvatar({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-accent/60 bg-bg text-accent shadow-glow ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none">
        <path
          d="M10 3.5c.6 3.9 2.1 5.4 6 6-3.9.6-5.4 2.1-6 6-.6-3.9-2.1-5.4-6-6 3.9-.6 5.4-2.1 6-6Z"
          fill="currentColor"
        />
        <path
          d="M18 13.5c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9Z"
          fill="currentColor"
          opacity="0.75"
        />
      </svg>
    </span>
  );
}

/** Online / thinking / offline dot. */
export function StatusDot({ tone }: { tone: "online" | "busy" | "offline" }) {
  const color =
    tone === "online" ? "bg-accent" : tone === "busy" ? "bg-highlight" : "bg-[var(--color-muted)]";
  return (
    <span aria-hidden="true" className="relative inline-flex size-2">
      {tone !== "offline" && (
        <span
          className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${color}`}
        />
      )}
      <span className={`relative inline-flex size-2 rounded-full ${color}`} />
    </span>
  );
}
