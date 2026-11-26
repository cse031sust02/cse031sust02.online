import { z } from "zod";

/** Shared by the form (client) and POST /api/contact (server). */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter your name." })
    .max(100, { error: "Name must be at most 100 characters." }),
  email: z.email({ error: "Please enter a valid email address." }).max(254),
  message: z
    .string()
    .trim()
    .min(10, { error: "Message must be at least 10 characters." })
    .max(5000, { error: "Message must be at most 5000 characters." }),
  /** Honeypot: humans never see or fill it. */
  website: z.string().max(500).optional().default(""),
  /** When the form was rendered (ms since epoch), for the minimum time-to-submit check. */
  renderedAt: z.number().int().nonnegative(),
  turnstileToken: z.string().max(4096).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export const MIN_SUBMIT_MS = 3000;

/** First error message per field. */
export function fieldErrors(error: z.ZodError): ContactFieldErrors {
  const out: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
