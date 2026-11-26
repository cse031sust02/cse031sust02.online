/** The twin's avatar: a small glowing bot face (decorative). */
export function AgentAvatar({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-accent/60 bg-bg text-accent shadow-glow ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none">
        <path d="M12 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="2" r="1.4" fill="currentColor" />
        <rect x="4" y="6" width="16" height="13" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="9" cy="12" r="1.6" fill="currentColor" />
        <circle cx="15" cy="12" r="1.6" fill="currentColor" />
        <path d="M9.5 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
