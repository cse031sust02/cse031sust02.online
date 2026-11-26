import type { ReactNode } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { navItem } from "@/config/nav";

type SectionProps = {
  /** Nav item id: gives the anchor, title and terminal command. */
  id: string;
  children: ReactNode;
};

/** A home-page section: anchor target + window card with a `$ command` prompt and an h2. */
export function Section({ id, children }: SectionProps) {
  const item = navItem(id);
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-20">
      <WindowCard title={`~/${item.dir ?? id} — zsh`}>
        <p aria-hidden="true" className="mb-1 font-mono text-sm text-muted">
          <span className="text-accent">$</span> {item.command}
        </p>
        <h2 id={headingId} className="mb-6 font-mono text-2xl font-bold text-fg sm:text-3xl">
          {item.label}
        </h2>
        {children}
      </WindowCard>
    </section>
  );
}
