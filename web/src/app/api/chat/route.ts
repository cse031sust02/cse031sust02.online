import { z } from "zod";
import { getProfile } from "@/lib/content/load-profile";
import { SlidingWindowRateLimiter, getClientIp } from "@/lib/rate-limit";
import {
  type ChatMessage,
  TwinUnavailableError,
  parseModels,
  streamChatCompletion,
} from "@/lib/twin/openrouter";
import { buildSystemPrompt } from "@/lib/twin/system-prompt";

const MAX_UPSTREAM_MESSAGES = 20;

const messageSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("user"), content: z.string().trim().min(1).max(1000) }),
  z.object({ role: z.literal("assistant"), content: z.string().trim().min(1).max(6000) }),
]);
const bodySchema = z.object({ messages: z.array(messageSchema).min(1).max(50) });

// 20 requests per IP per 10 minutes (per process; swap for Redis when scaled out).
const limiter = new SlidingWindowRateLimiter(20, 10 * 60 * 1000);

const json = (body: unknown, status: number, headers: HeadersInit = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  const rate = limiter.check(getClientIp(request.headers));
  if (!rate.allowed) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return json({ error: "twin_offline" }, 503);

  const history = parsed.data.messages.slice(-MAX_UPSTREAM_MESSAGES);
  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(getProfile()) },
    ...history,
  ];

  try {
    const stream = await streamChatCompletion({
      apiKey,
      models: parseModels(process.env.OPENROUTER_MODEL),
      messages,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      signal: request.signal,
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    // Log the failure reason only; never message content.
    if (error instanceof TwinUnavailableError)
      console.warn(`[twin] upstream unavailable: ${error.message}`);
    else console.warn("[twin] upstream error");
    return json({ error: "twin_offline" }, 503);
  }
}
