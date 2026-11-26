// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();
vi.mock("nodemailer", () => ({ default: { createTransport: vi.fn(() => ({ sendMail })) } }));

let POST: (req: Request) => Promise<Response>;
const NOW = 1_800_000_000_000;

const valid = (over: Record<string, unknown> = {}) => ({
  name: "Grace Visitor",
  email: "grace@example.org",
  message: "Hello, I'd like to talk about a project.",
  website: "",
  renderedAt: NOW - 10_000,
  ...over,
});

function submit(body: unknown, ip = "1.1.1.1") {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(async () => {
  vi.resetModules();
  sendMail.mockReset().mockResolvedValue({ messageId: "1" });
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  vi.stubEnv("SMTP_HOST", "smtp.test");
  vi.stubEnv("SMTP_PORT", "587");
  vi.stubEnv("SMTP_USER", "mailer@test.dev");
  vi.stubEnv("SMTP_PASS", "pw");
  vi.stubEnv("CONTACT_TO_EMAIL", "owner@test.dev");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.spyOn(console, "warn").mockImplementation(() => {});
  ({ POST } = await import("./route"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("sends one email to CONTACT_TO_EMAIL with Reply-To = visitor", async () => {
    const res = await submit(valid());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMail).toHaveBeenCalledTimes(1);
    const mail = sendMail.mock.calls[0][0];
    expect(mail.to).toBe("owner@test.dev");
    expect(mail.replyTo.address).toBe("grace@example.org");
    expect(mail.subject).toBe("[cse031sust02.dev] Message from Grace Visitor");
    expect(mail.text).toContain("I'd like to talk about a project.");
  });

  it("strips newlines from the name in the subject (header injection)", async () => {
    await submit(valid({ name: "Eve\r\nBcc: victim@example.com" }));
    expect(sendMail.mock.calls[0][0].subject).toBe(
      "[cse031sust02.dev] Message from Eve Bcc: victim@example.com",
    );
  });

  it("returns 400 with per-field errors", async () => {
    const res = await submit(valid({ name: "", email: "nope", message: "short" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid_request");
    expect(Object.keys(body.fields).sort()).toEqual(["email", "message", "name"]);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects over-long fields", async () => {
    const res = await submit(valid({ name: "x".repeat(101), message: "y".repeat(5001) }));
    expect((await res.json()).fields).toHaveProperty("name");
  });

  it("filled honeypot → 200 ok, no email", async () => {
    const res = await submit(valid({ website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("submitted sooner than 3 s after render → no email", async () => {
    const res = await submit(valid({ renderedAt: NOW - 1000 }));
    expect(res.status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("4th submission in 10 minutes from one IP → 429", async () => {
    for (let i = 0; i < 3; i++) expect((await submit(valid(), "7.7.7.7")).status).toBe(200);
    const res = await submit(valid(), "7.7.7.7");
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rate_limited" });
    expect(res.headers.get("retry-after")).toBeTruthy();
  });

  it("SMTP not configured → 503 contact_unavailable", async () => {
    vi.stubEnv("SMTP_HOST", "");
    const res = await submit(valid());
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "contact_unavailable" });
  });

  it("send failure → 503 (never silently dropped)", async () => {
    sendMail.mockRejectedValue(new Error("SMTP down"));
    const res = await submit(valid());
    expect(res.status).toBe(503);
  });

  it("with TURNSTILE_SECRET_KEY, a missing or invalid token → 400", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ success: false }));
    vi.stubGlobal("fetch", fetchMock);

    let res = await submit(valid());
    expect(res.status).toBe(400);
    expect((await res.json()).fields).toHaveProperty("turnstileToken");
    expect(fetchMock).not.toHaveBeenCalled();

    res = await submit(valid({ turnstileToken: "bad" }));
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();

    fetchMock.mockResolvedValue(Response.json({ success: true }));
    res = await submit(valid({ turnstileToken: "good" }));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it("never echoes the destination address", async () => {
    const res = await submit(valid());
    expect(await res.text()).not.toContain("owner@test.dev");
  });
});
