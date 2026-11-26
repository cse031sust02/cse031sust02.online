import type { Profile } from "@/lib/content/schema";
import { Section } from "./Section";

export function About({ profile }: { profile: Profile }) {
  const { basics, stats } = profile;
  return (
    <Section id="about">
      <p className="max-w-3xl leading-relaxed text-fg">{basics.summary}</p>
      <p className="mt-6 rounded-chip border border-border bg-surface-2 px-4 py-3 font-mono text-sm">
        <span className="text-highlight">status:</span> {basics.status}
      </p>
      {stats.length > 0 && (
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-chip border border-border p-4">
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className="font-mono text-3xl font-bold text-accent">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}
