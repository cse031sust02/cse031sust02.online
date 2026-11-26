import type { Profile } from "@/lib/content/schema";
import { Section } from "./Section";

export function Skills({ profile }: { profile: Profile }) {
  const groups = profile.skills;
  return (
    <Section id="skills">
      <p aria-hidden="true" className="mb-3 font-mono text-sm text-accent-2">
        ~/skills
      </p>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-4 font-mono text-sm sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, gi) => {
          const lastGroup = gi === groups.length - 1;
          return (
            <li key={group.group}>
              <h3 className="font-bold text-highlight">
                <span aria-hidden="true" className="text-muted">
                  {lastGroup ? "└── " : "├── "}
                </span>
                {group.group}/
              </h3>
              <ul aria-label={group.group}>
                {group.items.map((skill, si) => (
                  <li key={skill} className="text-fg">
                    <span aria-hidden="true" className="whitespace-pre text-muted">
                      {lastGroup ? "    " : "│   "}
                      {si === group.items.length - 1 ? "└── " : "├── "}
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
