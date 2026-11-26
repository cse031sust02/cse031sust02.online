const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export const DEFAULT_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "baidu/ernie-5.5-flash-preview:free",
  "openrouter/free",
];

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class TwinUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TwinUnavailableError";
  }
}

/** Parses OPENROUTER_MODEL ("a,b,c") into a fallback list; empty → defaults. */
export function parseModels(value: string | undefined): string[] {
  const models = (value ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return models.length ? models : DEFAULT_MODELS;
}

type StreamOptions = {
  apiKey: string;
  models: string[];
  messages: ChatMessage[];
  siteUrl?: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
};

const RETRYABLE = (status: number) => status === 429 || status >= 500;

/**
 * Calls OpenRouter with streaming. Before streaming starts, a 429/5xx (or network error)
 * moves on to the next model. Resolves to a stream of plain-text assistant tokens.
 */
export async function streamChatCompletion(
  opts: StreamOptions,
): Promise<ReadableStream<Uint8Array>> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  let lastError = "no models configured";

  for (let i = 0; i < opts.models.length; i++) {
    // OpenRouter's `models` array is its own fallback list; we also retry ourselves.
    const models = opts.models.slice(i, i + 3);
    let res: Response;
    try {
      res = await fetchImpl(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": opts.siteUrl ?? "https://cse031sust02.dev",
          "X-Title": "cse031sust02.dev Digital Twin",
        },
        body: JSON.stringify({
          model: models[0],
          models,
          messages: opts.messages,
          stream: true,
          max_tokens: 600,
          temperature: 0.6,
        }),
        signal: opts.signal,
      });
    } catch (error) {
      if (opts.signal?.aborted) throw error;
      lastError = `network error on ${models[0]}`;
      continue;
    }

    if (res.ok && res.body) return sseToText(res.body);
    lastError = `HTTP ${res.status} from ${models[0]}`;
    await res.body?.cancel().catch(() => {});
    if (!RETRYABLE(res.status)) break;
  }
  throw new TwinUnavailableError(lastError);
}

/** Converts an OpenAI-style SSE stream into a stream of text deltas. */
export function sseToText(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const reader = body.getReader();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (true) {
        const newline = buffer.indexOf("\n");
        if (newline !== -1) {
          const line = buffer.slice(0, newline).trim();
          buffer = buffer.slice(newline + 1);
          if (!line.startsWith("data:")) continue; // comments like ": OPENROUTER PROCESSING"
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            controller.close();
            await reader.cancel().catch(() => {});
            return;
          }
          try {
            const json = JSON.parse(data);
            if (json.error) {
              controller.close();
              await reader.cancel().catch(() => {});
              return;
            }
            const delta: unknown = json.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta.length > 0) {
              controller.enqueue(encoder.encode(delta));
              return;
            }
          } catch {
            /* ignore malformed lines */
          }
          continue;
        }
        const { value, done } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}
