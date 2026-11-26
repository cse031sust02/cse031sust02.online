import type { Profile } from "@/lib/content/schema";
import { formatDateRange } from "@/lib/content/dates";
import { ExperienceItem } from "./ExperienceItem";
import { Section } from "./Section";
import { commitHash } from "./commit-hash";

export function Experience({ profile }: { profile: Profile }) {
  return (
    <Section id="experience">
      <ol className="ml-1">
        {profile.experience.map((entry, i) => (
          <ExperienceItem
            key={`${entry.company}-${entry.start}`}
            entry={entry}
            hash={commitHash(`${entry.company}${entry.role}${entry.start}`)}
            dateRange={formatDateRange(entry.start, entry.end)}
            isHead={i === 0}
            defaultOpen={i === 0}
          />
        ))}
      </ol>
    </Section>
  );
}
