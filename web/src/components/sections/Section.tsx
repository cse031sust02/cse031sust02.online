import type { ReactNode } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NAV_ITEMS, navItem } from "@/config/nav";

type SectionProps = {
  /** Nav item id: gives the anchor, title and terminal command. */
  id: string;
  children: ReactNode;
};

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const pad2 = (n: number) => String(n).padStart(2, "0");
const toArabicIndic = (s: string) => s.replace(/\d/g, (d) => ARABIC_INDIC[Number(d)]);

/**
 * A home-page section: anchor target + window card with an h2. The eyebrow above the heading
 * is themed: a `$ command` prompt (Terminal) or an ornamental numeral (Mirage).
 */
export function Section({ id, children }: SectionProps) {
  const item = navItem(id);
  const headingId = `${id}-heading`;
  const number = pad2(NAV_ITEMS.findIndex((n) => n.id === id) + 1);
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-20">
      <WindowCard title={`~/${item.dir ?? id} — zsh`}>
        <p aria-hidden="true" className="theme-terminal mb-1 font-mono text-sm text-muted">
          <span className="text-accent">$</span> {item.command}
        </p>
        <p aria-hidden="true" className="theme-mirage section-eyebrow">
          <span lang="ar">{toArabicIndic(number)}</span>
          <span className="section-eyebrow-rule" />
          <span>{number}</span>
        </p>
        <h2
          id={headingId}
          className="section-title mb-6 font-display text-2xl font-bold text-fg sm:text-3xl"
        >
          {item.label}
        </h2>
        {children}
      </WindowCard>
    </section>
  );
}
