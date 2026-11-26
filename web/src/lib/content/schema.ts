import { z } from "zod";
import { YEAR_MONTH_RE } from "./dates";
import { privacyViolation } from "./privacy";

/** A non-empty string that passes the privacy guard. */
const text = z
  .string({ error: "expected text" })
  .trim()
  .min(1, { error: "must not be empty" })
  .superRefine((value, ctx) => {
    const reason = privacyViolation(value);
    if (reason) ctx.addIssue({ code: "custom", message: reason });
  });

/** Like `text`, but may be empty (twin notes the owner hasn't filled in yet). */
const optionalText = z.string({ error: "expected text" }).superRefine((value, ctx) => {
  const reason = privacyViolation(value);
  if (reason) ctx.addIssue({ code: "custom", message: reason });
});

const url = z.url({ protocol: /^https?$/, error: "expected an http(s) URL" });

const yearMonth = z.string({ error: "expected YYYY-MM" }).regex(YEAR_MONTH_RE, {
  error: "expected YYYY-MM",
});
const endDate = z.union([yearMonth, z.literal("present")], {
  error: 'expected YYYY-MM or "present"',
});
const year = z
  .number({ error: "expected a year (number)" })
  .int({ error: "expected a year (number)" })
  .min(1900, { error: "expected a year (number)" })
  .max(2100, { error: "expected a year (number)" });

export const basicsSchema = z.strictObject({
  name: text,
  /** Optional Arabic-script name, drawn as calligraphy in the Mirage theme hero. */
  name_arabic: text.optional(),
  handle: text,
  title: text,
  tagline: text,
  years_of_experience: z.number({ error: "expected a number" }).int().nonnegative(),
  summary: text,
  status: text,
});

export const statSchema = z.strictObject({ label: text, value: text });

export const linkSchema = z.strictObject({
  label: text,
  url,
  icon: text.optional(),
});

export const experienceSchema = z.strictObject({
  company: text,
  role: text,
  start: yearMonth,
  end: endDate,
  highlights: z.array(text),
  tech: z.array(text).default([]),
});

export const productSchema = z.strictObject({
  name: text,
  company: text,
  role: text,
  start: yearMonth,
  end: endDate,
  description: text,
  url,
  tags: z.array(text).default([]),
});

export const skillGroupSchema = z.strictObject({
  group: text,
  items: z.array(text).min(1, { error: "must list at least one skill" }),
});

export const educationSchema = z.strictObject({
  institution: text,
  degree: text,
  location: text.optional(),
  start: year.optional(),
  end: year,
});

export const certificationSchema = z.strictObject({
  name: text,
  issuer: text,
  date: yearMonth,
  url,
});

export const awardSchema = z.strictObject({
  name: text,
  year,
  for: text.optional(),
});

export const faqSchema = z.strictObject({ q: text, a: text });

/** Twin-only notes. Known keys are typed; extra keys (text or list of text) are allowed. */
export const twinNotesSchema = z
  .object({
    current_focus: optionalText.default(""),
    leadership_philosophy: optionalText.default(""),
    how_i_work: optionalText.default(""),
    interests: optionalText.default(""),
    location_and_timezone: optionalText.default(""),
    fun_facts: z.array(text).default([]),
    faq: z.array(faqSchema).default([]),
  })
  .catchall(z.union([optionalText, z.array(text)]));

export const profileSchema = z.strictObject({
  basics: basicsSchema,
  stats: z.array(statSchema).default([]),
  links: z.array(linkSchema).default([]),
  experience: z.array(experienceSchema),
  products: z.array(productSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  education: z.array(educationSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  awards: z.array(awardSchema).default([]),
  twin_notes: twinNotesSchema.default({
    current_focus: "",
    leadership_philosophy: "",
    how_i_work: "",
    interests: "",
    location_and_timezone: "",
    fun_facts: [],
    faq: [],
  }),
});

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Product = z.infer<typeof productSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Award = z.infer<typeof awardSchema>;
export type ProfileLink = z.infer<typeof linkSchema>;
export type Stat = z.infer<typeof statSchema>;
export type TwinNotes = z.infer<typeof twinNotesSchema>;
