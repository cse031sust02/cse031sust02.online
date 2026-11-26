import { ContactForm } from "@/components/contact/ContactForm";
import type { Profile } from "@/lib/content/schema";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Section } from "./Section";

/** Contact form + public links. Never shows an email address or phone number. */
export function Contact({ profile }: { profile: Profile }) {
  return (
    <Section id="contact">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <ContactForm />
        <div>
          <p className="text-sm text-muted">Or find me here:</p>
          <ul className="mt-3 space-y-2 font-mono text-sm">
            {profile.links.map((link) => (
              <li key={link.url}>
                <ExternalLink href={link.url} className="text-accent-2 hover:underline">
                  {link.label} ↗
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
