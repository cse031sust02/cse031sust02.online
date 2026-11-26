import type { Profile } from "@/lib/content/schema";
import { formatDate, formatDateRange } from "@/lib/content/dates";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Section } from "./Section";

const subheading = "mb-3 font-mono text-sm font-bold uppercase tracking-wider text-highlight";

export function Credentials({ profile }: { profile: Profile }) {
  const { education, certifications, awards } = profile;
  return (
    <Section id="credentials">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {education.length > 0 && (
          <div>
            <h3 className={subheading}>Education</h3>
            <ul className="space-y-4">
              {education.map((item) => (
                <li key={`${item.institution}-${item.degree}`}>
                  <p className="font-semibold text-fg">{item.degree}</p>
                  <p className="text-sm text-muted">
                    {item.institution}
                    {item.location ? `, ${item.location}` : ""}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {formatDateRange(item.start, item.end)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h3 className={subheading}>Certifications</h3>
            <ul className="space-y-4">
              {certifications.map((cert) => (
                <li key={cert.url}>
                  <p className="font-semibold text-fg">{cert.name}</p>
                  <p className="text-sm text-muted">
                    {cert.issuer} · {formatDate(cert.date)}
                  </p>
                  <ExternalLink
                    href={cert.url}
                    className="font-mono text-xs text-accent-2 hover:underline"
                  >
                    verify ↗<span className="sr-only"> {cert.name}</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        {awards.length > 0 && (
          <div>
            <h3 className={subheading}>Awards</h3>
            <ul className="space-y-4">
              {awards.map((award) => (
                <li key={`${award.name}-${award.year}`}>
                  <p className="font-semibold text-fg">{award.name}</p>
                  <p className="text-sm text-muted">
                    {award.year}
                    {award.for ? ` · ${award.for}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
