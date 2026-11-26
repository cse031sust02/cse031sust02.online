import type { Profile } from "@/lib/content/schema";
import { ExternalLink } from "@/components/ui/ExternalLink";

export function SiteFooter({ profile }: { profile: Profile }) {
  const { basics, links } = profile;
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-accent">uptime:</span> {basics.years_of_experience}+ years ·{" "}
          <span className="text-accent">built with</span> Next.js, Tailwind, too much coffee
        </p>
        <ul className="flex gap-4">
          {links.map((link) => (
            <li key={link.url}>
              <ExternalLink href={link.url} className="hover:text-accent">
                {link.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
        <p>© {basics.name}</p>
      </div>
    </footer>
  );
}
