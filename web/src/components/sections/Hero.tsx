import type { Profile } from "@/lib/content/schema";
import { AsciiName } from "@/components/hero/AsciiName";
import { Typewriter } from "@/components/hero/Typewriter";
import { MatrixRain } from "@/components/nerd/MatrixRain";
import { ExternalLink } from "@/components/ui/ExternalLink";

const ctaBase =
  "inline-flex items-center gap-2 rounded-chip border px-4 py-2 font-mono text-sm transition-colors";

export function Hero({ profile }: { profile: Profile }) {
  const { basics, links } = profile;
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate scroll-mt-20 py-12 sm:py-20"
    >
      <MatrixRain className="absolute inset-0 -z-10 size-full opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <AsciiName name={basics.name} />
      <p className="mt-6 mb-4 font-mono text-sm text-muted">
        <span className="text-accent">
          {basics.name.split(" ")[0].toLowerCase()}@{basics.handle}
        </span>
        :~$ whoami
      </p>
      <h1
        id="hero-heading"
        className="font-mono text-3xl font-bold tracking-tight text-fg sm:text-5xl"
      >
        {basics.name}
      </h1>
      <p className="mt-3 font-mono text-lg text-accent-2 sm:text-xl">{basics.title}</p>
      <Typewriter text={basics.tagline} className="mt-4 min-h-[3.5rem] max-w-2xl text-lg text-fg" />
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <a
            href="#twin"
            className={`${ctaBase} border-accent bg-accent text-bg hover:bg-transparent hover:text-accent`}
          >
            Chat with my AI Agent
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
