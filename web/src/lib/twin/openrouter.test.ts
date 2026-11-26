// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { sseResponse } from "@/test/sse";
import {
  DEFAULT_MODELS,
  TwinUnavailableError,
  parseModels,
  streamChatCompletion,
} from "./openrouter";

const base = { apiKey: "sk-test", messages: [{ role: "user" as const, content: "hi" }] };

describe("parseModels", () => {
  it("splits a comma list and falls back to defaults", () => {
    expect(parseModels(" a , b,,c ")).toEqual(["a", "b", "c"]);
    expect(parseModels(undefined)).toEqual(DEFAULT_MODELS);
  });
});

describe("streamChatCompletion", () => {
  it("streams text deltas and sends the expected request", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(sseResponse(["Hel", "lo"]));
    const stream = await streamChatCompletion({ ...base, models: ["m1", "m2"], fetchImpl });
    expect(await new Response(stream).text()).toBe("Hello");

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      model: "m1",
      models: ["m1", "m2"],
      stream: true,
      max_tokens: 600,
      temperature: 0.6,
    });
    expect(init.headers.Authorization).toBe("Bearer sk-test");
    expect(init.headers["HTTP-Referer"]).toBeDefined();
    expect(init.headers["X-Title"]).toBeDefined();
  });

  it("tries the next model on 429 and 5xx", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(new Response("down", { status: 503 }))
      .mockResolvedValueOnce(sseResponse(["ok"]));
    const stream = await streamChatCompletion({ ...base, models: ["m1", "m2", "m3"], fetchImpl });
    expect(await new Response(stream).text()).toBe("ok");
    expect(fetchImpl.mock.calls.map((c) => JSON.parse(c[1].body).model)).toEqual([
      "m1",
      "m2",
      "m3",
    ]);
  });

  it("does not retry on a 4xx other than 429", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("bad key", { status: 401 }));
    await expect(
      streamChatCompletion({ ...base, models: ["m1", "m2"], fetchImpl }),
    ).rejects.toBeInstanceOf(TwinUnavailableError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("throws TwinUnavailableError when every model fails", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("", { status: 500 }));
    await expect(
      streamChatCompletion({ ...base, models: ["m1", "m2"], fetchImpl }),
    ).rejects.toThrow(TwinUnavailableError);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
