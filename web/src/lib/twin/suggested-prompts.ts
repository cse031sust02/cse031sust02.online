import type { Profile } from "@/lib/content/schema";

/** How many suggested chips are shown at once (pinned ones included). */
export const SHOWN_PROMPTS = 3;

export type PromptSet = {
  /** Always shown first: the first twin_notes.faq question, if any. */
  pinned: string[];
  /** Pool the remaining chips are drawn from at random. */
  pool: string[];
};

/** Suggested questions, built from the profile (no hard-coded facts). */
export function suggestedPrompts(profile: Profile): PromptSet {
  const faq = profile.twin_notes.faq[0];
  const product = profile.products[0];
  const pool = [
    "What are you working on right now?",
    ...(product ? [`Tell me about ${product.name}.`] : []),
    "How do you lead engineering teams?",
    "Are you open to new opportunities?",
    "What's your tech stack?",
    "How do you use AI agents in engineering?",
    "Which products have you built from scratch?",
    "Walk me through your career.",
    "Where did you study?",
    "What certifications do you have?",
  ];
  return { pinned: faq ? [faq.q] : [], pool };
}

/** Pinned prompts first, then the pool in random order (Fisher–Yates). */
export function orderPrompts(set: PromptSet, random: () => number = Math.random): string[] {
  const pool = [...set.pool];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return [...set.pinned, ...pool];
}
