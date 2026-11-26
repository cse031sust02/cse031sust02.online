import type { Profile } from "@/lib/content/schema";
import { Section } from "./Section";

/** Suggested questions, built from the profile (no hard-coded facts). */
export function suggestedPrompts(profile: Profile): string[] {
  const prompts = ["What are you working on right now?"];
  const product = profile.products[0];
  if (product) prompts.push(`Tell me about ${product.name}.`);
  prompts.push("How do you lead engineering teams?");
  return prompts;
}

/** Placeholder until the Digital Twin (spec 005) is wired up. */
export function TwinTeaser({ profile }: { profile: Profile }) {
  return (
    <Section id="twin">
      <p className="max-w-2xl text-fg">
        Ask an AI twin of {profile.basics.name.split(" ")[0]}, trained only on this CV, about
        experience, products and how he works.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
        {suggestedPrompts(profile).map((prompt) => (
          <li
            key={prompt}
            className="rounded-chip border border-border px-3 py-1.5 font-mono text-xs text-muted"
          >
            {prompt}
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        className="mt-6 cursor-not-allowed rounded-chip border border-border px-4 py-2 font-mono text-sm text-muted"
      >
        ./twin --chat (coming soon)
      </button>
    </Section>
  );
}
