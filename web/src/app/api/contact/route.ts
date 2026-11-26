import { fieldErrors, MIN_SUBMIT_MS, contactSchema } from "@/lib/contact/schema";
import { getMailConfig, sendContactEmail } from "@/lib/contact/mailer";
import { verifyTurnstile } from "@/lib/contact/turnstile";
import { SlidingWindowRateLimiter, getClientIp } from "@/lib/rate-limit";

// 3 submissions per IP per 10 minutes (per process).
const limiter = new SlidingWindowRateLimiter(3, 10 * 60 * 1000);

const json = (body: unknown, status: number, headers: HeadersInit = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rate = limiter.check(ip);
  if (!rate.allowed) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ error: "invalid_request", fields: fieldErrors(parsed.error) }, 400);
  }
  const input = parsed.data;

  // Bots: pretend success, send nothing.
  if (input.website.trim() !== "") return json({ ok: true }, 200);
  if (Date.now() - input.renderedAt < MIN_SUBMIT_MS) return json({ ok: true }, 200);

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && !(await verifyTurnstile(input.turnstileToken, turnstileSecret, ip))) {
    return json(
      { error: "invalid_request", fields: { turnstileToken: "Please complete the verification." } },
      400,
    );
  }

  const config = getMailConfig();
  if (!config) return json({ error: "contact_unavailable" }, 503);

  try {
    await sendContactEmail(config, input);
    return json({ ok: true }, 200);
  } catch (error) {
    // Never log the visitor's message or addresses.
    console.warn(`[contact] send failed: ${(error as Error)?.name ?? "error"}`);
    return json({ error: "contact_unavailable" }, 503);
  }
}
