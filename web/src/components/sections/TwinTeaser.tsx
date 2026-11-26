import { disclaimer } from "@/lib/twin/disclaimer";
import { TwinTeaserActions } from "@/components/twin/TwinTeaserActions";
import type { Profile } from "@/lib/content/schema";
import { Section } from "./Section";

export function TwinTeaser({ profile }: { profile: Profile }) {
  return (
    <Section id="twin">
      <p className="max-w-2xl text-fg">
        Ask my AI twin about my experience, products and how I work. It answers in first person,
        only from my CV.
      </p>
      <TwinTeaserActions />
      <p className="mt-4 text-xs text-muted">{disclaimer(profile.basics.name.split(" ")[0])}</p>
    </Section>
  );
}
