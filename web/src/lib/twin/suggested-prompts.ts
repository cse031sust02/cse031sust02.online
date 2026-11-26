import type { Profile } from "@/lib/content/schema";

/** Suggested first questions, built from the profile (no hard-coded facts). */
export function suggestedPrompts(profile: Profile): string[] {
  const prompts = ["What are you working on right now?"];
  const product = profile.products[0];
  if (product) prompts.push(`Tell me about ${product.name}.`);
  prompts.push("How do you lead engineering teams?", "Are you open to new opportunities?");
  return prompts;
}
