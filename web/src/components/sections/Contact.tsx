import type { Profile } from "@/lib/content/schema";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Section } from "./Section";

/** Placeholder until the contact form (spec 006). Never shows an email or phone number. */
export function Contact({ profile }: { profile: Profile }) {
  return (
    <Section id="contact">
      <p className="text-fg">The contact form is coming soon. Meanwhile, find me here:</p>
      <ul className="mt-4 flex flex-wrap gap-4 font-mono text-sm">
        {profile.links.map((link) => (
          <li key={link.url}>
            <ExternalLink href={link.url} className="text-accent-2 hover:underline">
              {link.label} ↗
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
