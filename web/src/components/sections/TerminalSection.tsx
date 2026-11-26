import { Terminal } from "@/components/terminal/Terminal";
import type { Profile } from "@/lib/content/schema";
import { toTerminalData } from "@/lib/terminal/data";
import { Section } from "./Section";

export function TerminalSection({ profile }: { profile: Profile }) {
  return (
    <Section id="terminal">
      <p className="mb-4 text-sm text-muted">
        Prefer the keyboard? Try <code className="text-accent-2">help</code>,{" "}
        <code className="text-accent-2">whoami</code> or{" "}
        <code className="text-accent-2">ls products</code>. Everything here is also on the page.
      </p>
      <Terminal data={toTerminalData(profile)} prompt="visitor@talhaos:~$" />
    </Section>
  );
}
