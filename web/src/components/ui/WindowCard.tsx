import type { ReactNode } from "react";

type WindowCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  /** Element used for the card wrapper. */
  as?: "div" | "article" | "section";
};

/** Window-chrome card: title bar with traffic-light dots, then content. */
export function WindowCard({ title, children, className = "", as: Tag = "div" }: WindowCardProps) {
  return (
    <Tag
      className={`window-card overflow-hidden rounded-window border border-border bg-surface shadow-glow ${className}`}
    >
      <div className="window-bar flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2">
        <span aria-hidden="true" className="window-dots flex gap-1.5">
          <span className="size-3 rounded-full bg-[var(--color-dot-red)]" />
          <span className="size-3 rounded-full bg-[var(--color-dot-yellow)]" />
          <span className="size-3 rounded-full bg-[var(--color-dot-green)]" />
        </span>
        <span className="window-title ml-2 truncate font-mono text-xs text-muted">{title}</span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </Tag>
  );
}
