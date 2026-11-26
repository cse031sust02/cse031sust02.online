import { formatDateRange } from "@/lib/content/dates";
import type { Profile } from "@/lib/content/schema";

/** The slice of the profile the terminal needs (serializable, sent to the client). */
export type TerminalData = {
  name: string;
  title: string;
  tagline: string;
  products: { name: string; company: string; description: string }[];
  experience: { role: string; company: string; dates: string }[];
  skills: { group: string; items: string[] }[];
};

export function toTerminalData(profile: Profile): TerminalData {
  return {
    name: profile.basics.name,
    title: profile.basics.title,
    tagline: profile.basics.tagline,
    products: profile.products.map((p) => ({
      name: p.name,
      company: p.company,
      description: p.description,
    })),
    experience: profile.experience.map((e) => ({
      role: e.role,
      company: e.company,
      dates: formatDateRange(e.start, e.end),
    })),
    skills: profile.skills.map((s) => ({ group: s.group, items: [...s.items] })),
  };
}
