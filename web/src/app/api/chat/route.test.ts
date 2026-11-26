// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sseResponse } from "@/test/sse";

let POST: (req: Request) => Promise<Response>;
let fetchMock: ReturnType<typeof vi.fn>;

function chat(body: unknown, ip = "1.1.1.1") {
  return POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}
const ask = (content = "hi") => ({ messages: [{ role: "user", content }] });

beforeEach(async () => {
  vi.resetModules(); // fresh rate limiter per test
  vi.stubEnv("OPENROUTER_API_KEY", "sk-or-test");
  vi.stubEnv("OPENROUTER_MODEL", "m1,m2");
  fetchMock = vi.fn().mockImplementation(async () => sseResponse(["Hi ", "there"]));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  ({ POST } = await import("./route"));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/chat", () => {
  it("streams the assistant reply as text", async () => {
    const res = await chat(ask());
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/plain/);
    expect(await res.text()).toBe("Hi there");
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.messages[0].role).toBe("system");
  });

  it.each([
    ["wrong role", { messages: [{ role: "system", content: "x" }] }],
    ["empty content", ask("   ")],
    ["content over 1000 chars", ask("x".repeat(1001))],
    ["no messages", { messages: [] }],
    [
      "over 50 messages",
      { messages: Array.from({ length: 51 }, () => ({ role: "user", content: "x" })) },
    ],
    ["not JSON", "{oops"],
  ])("rejects %s with 400", async (_, body) => {
    const res = await chat(body);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_request" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends only the last 20 messages upstream", async () => {
    const messages = Array.from({ length: 30 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `msg ${i}`,
    }));
    await (await chat({ messages })).text();
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body).messages;
    expect(sent).toHaveLength(21); // system + 20
    expect(sent[1].content).toBe("msg 10");
    expect(sent.at(-1).content).toBe("msg 29");
  });

  it("returns 429 with Retry-After on the 21st request within 10 minutes from one IP", async () => {
    for (let i = 0; i < 20; i++) expect((await chat(ask(), "9.9.9.9")).status).toBe(200);
    const res = await chat(ask(), "9.9.9.9");
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rate_limited" });
    expect(Number(res.headers.get("retry-after"))).toBeGreaterThan(0);
    expect((await chat(ask(), "8.8.8.8")).status).toBe(200);
  });

  it("falls back to the next model on a 429 from the first", async () => {
    fetchMock.mockReset();
    fetchMock
      .mockResolvedValueOnce(new Response("", { status: 429 }))
      .mockResolvedValueOnce(sseResponse(["from m2"]));
    const res = await chat(ask());
    expect(await res.text()).toBe("from m2");
    expect(fetchMock.mock.calls.map((c) => JSON.parse(c[1].body).model)).toEqual(["m1", "m2"]);
  });

  it("returns 503 twin_offline without an API key", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const res = await chat(ask());
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "twin_offline" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 503 when every model fails", async () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response("", { status: 502 }));
    const res = await chat(ask());
    expect(res.status).toBe(503);
  });
});
