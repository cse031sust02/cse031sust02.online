import type { Profile } from "@/lib/content/schema";
import { ExternalLink } from "@/components/ui/ExternalLink";

const ctaBase =
  "inline-flex items-center gap-2 rounded-chip border px-4 py-2 font-mono text-sm transition-colors";

export function Hero({ profile }: { profile: Profile }) {
  const { basics, links } = profile;
  return (
    <section id="top" aria-labelledby="hero-heading" className="scroll-mt-20 py-12 sm:py-20">
      <p className="mb-4 font-mono text-sm text-muted">
        <span className="text-accent">{basics.handle}@talhaos</span>:~$ whoami
      </p>
      <h1
        id="hero-heading"
        className="font-mono text-4xl font-bold tracking-tight text-accent text-glow sm:text-6xl"
      >
        {basics.name}
      </h1>
      <p className="mt-3 font-mono text-lg text-accent-2 sm:text-xl">{basics.title}</p>
      <p className="mt-4 max-w-2xl text-lg text-fg">{basics.tagline}</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <a
            href="#twin"
            className={`${ctaBase} border-accent bg-accent text-bg hover:bg-transparent hover:text-accent`}
          >
            Chat with my twin
          </a>
        </li>
        <li>
          <a href="#contact" className={`${ctaBase} border-border text-fg hover:border-accent`}>
            Contact
          </a>
        </li>
        {links.map((link) => (
          <li key={link.url}>
            <ExternalLink
              href={link.url}
              className={`${ctaBase} border-border text-fg hover:border-accent`}
            >
              {link.label} ↗
            </ExternalLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
