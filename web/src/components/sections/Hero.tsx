import type { Profile } from "@/lib/content/schema";
import { AsciiName } from "@/components/hero/AsciiName";
import { MirageScene } from "@/components/hero/MirageScene";
import { Typewriter } from "@/components/hero/Typewriter";
import { MatrixRain } from "@/components/nerd/MatrixRain";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { seededRandom } from "@/lib/theme/geometry";

// Mirage gold dust: deterministic so server and client markup match.
const DUST = (() => {
  const rand = seededRandom(11);
  return Array.from({ length: 22 }, () => ({
    left: `${(rand() * 100).toFixed(1)}%`,
    top: `${(30 + rand() * 70).toFixed(1)}%`,
    size: `${(1.5 + rand() * 2.5).toFixed(1)}px`,
    delay: `${(rand() * -12).toFixed(1)}s`,
    duration: `${(8 + rand() * 8).toFixed(1)}s`,
  }));
})();

const ctaBase =
  "cta inline-flex items-center gap-2 rounded-chip border px-4 py-2 font-mono text-sm transition-colors";

/**
 * Hero. Theme-specific art is rendered for every theme and shown by CSS (.theme-terminal /
 * .theme-mirage), so switching themes needs no re-render and causes no hydration mismatch.
 */
export function Hero({ profile }: { profile: Profile }) {
  const { basics, links } = profile;
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="hero relative isolate scroll-mt-20 py-12 sm:py-20"
    >
      <div className="theme-terminal">
        <MatrixRain className="absolute inset-0 -z-10 size-full opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <AsciiName name={basics.name} />
      </div>

      <div aria-hidden="true" className="theme-mirage mirage-dust">
        {DUST.map((d, i) => (
          <span
            key={i}
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDelay: d.delay,
              animationDuration: d.duration,
            }}
          />
        ))}
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="theme-terminal mt-6 mb-4 font-mono text-sm text-muted">
            <span className="text-accent">
              {basics.name.split(" ")[0].toLowerCase()}@{basics.handle}
            </span>
            :~$ whoami
          </p>
          <div className="theme-mirage" aria-hidden="true">
            <p className="mirage-eyebrow">{basics.handle}</p>
            {basics.name_arabic ? (
              <p lang="ar" dir="rtl" className="mirage-calligraphy">
                {basics.name_arabic}
              </p>
            ) : null}
          </div>
          <h1
            id="hero-heading"
            className="hero-title font-display text-3xl font-bold tracking-tight text-fg sm:text-5xl"
          >
            {basics.name}
          </h1>
          <p className="hero-role mt-3 font-mono text-lg text-accent-2 sm:text-xl">
            {basics.title}
          </p>
          <Typewriter
            text={basics.tagline}
            className="mt-4 min-h-[3.5rem] max-w-2xl text-lg text-fg"
          />
          {/* Primary CTA on its own; secondary links grouped in one row (Mirage stacks them). */}
          <div className="hero-ctas mt-8 flex flex-wrap gap-3">
            <a
              href="#twin"
              className={`${ctaBase} cta-primary border-accent bg-accent text-bg hover:bg-transparent hover:text-accent`}
            >
              <span aria-hidden="true" className="cta-badge theme-mirage-inline">
                ✦
              </span>
              <span className="cta-text">
                <span className="cta-label">Chat with my AI Agent</span>
                <span className="cta-sub theme-mirage-inline">
                  Ask about my experience, products and how I work
                </span>
              </span>
              <span aria-hidden="true" className="cta-arrow theme-mirage-inline">
                →
              </span>
            </a>
            <ul className="hero-links flex flex-wrap gap-3">
              <li>
                <a
                  href="#contact"
                  className={`${ctaBase} cta-secondary border-border text-fg hover:border-accent`}
                >
                  Contact
                </a>
              </li>
              {links.map((link) => (
                <li key={link.url}>
                  <ExternalLink
                    href={link.url}
                    className={`${ctaBase} cta-secondary border-border text-fg hover:border-accent`}
                  >
                    {link.label} ↗
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="theme-mirage hero-art">
          <MirageScene />
        </div>
      </div>
    </section>
  );
}
