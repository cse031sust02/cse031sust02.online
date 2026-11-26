"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { type ContactFieldErrors, contactSchema, fieldErrors } from "@/lib/contact/schema";

type Status = "idle" | "sending" | "sent" | "unavailable" | "rate_limited" | "error";

const STATUS_TEXT: Record<Exclude<Status, "idle" | "sending">, string> = {
  sent: "Message sent. Thanks! I'll get back to you soon.",
  unavailable: "Contact temporarily unavailable. Please try again later or reach out on LinkedIn.",
  rate_limited: "Too many messages from your connection. Please try again in a few minutes.",
  error: "Something went wrong. Please try again.",
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Records when the form became usable (for the server's minimum time-to-submit check). */
function stamp(ref: { current: number }) {
  ref.current = Date.now();
}

const inputClass =
  "w-full rounded-chip border border-border bg-bg px-3 py-2 font-mono text-sm text-fg placeholder:text-muted focus:border-accent aria-[invalid=true]:border-danger";

export function ContactForm() {
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const renderedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => stamp(renderedAt), []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
      renderedAt: renderedAt.current,
      turnstileToken: (form.get("cf-turnstile-response") as string | null) ?? undefined,
    };

    const local = contactSchema.safeParse(payload);
    if (!local.success) {
      const errs = fieldErrors(local.error);
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("sent");
        formRef.current?.reset();
        stamp(renderedAt);
        return;
      }
      if (res.status === 429) return setStatus("rate_limited");
      if (res.status === 503) return setStatus("unavailable");
      const body = (await res.json().catch(() => ({}))) as { fields?: ContactFieldErrors };
      if (body.fields) {
        setErrors(body.fields);
        focusFirstError(body.fields);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const focusFirstError = (errs: ContactFieldErrors) => {
    const first = (["name", "email", "message"] as const).find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const field = (name: "name" | "email" | "message") => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });

  const errorText = (name: keyof ContactFieldErrors) =>
    errors[name] ? (
      <p id={`${uid}-${name}-error`} className="mt-1 font-mono text-xs text-danger">
        ✗ {errors[name]}
      </p>
    ) : null;

  const notice = status !== "idle" && status !== "sending" ? STATUS_TEXT[status] : null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
      aria-label="Contact form"
    >
      <div>
        <label htmlFor={`${uid}-name`} className="mb-1 block font-mono text-sm text-accent">
          $ name
        </label>
        <input
          {...field("name")}
          data-autofocus
          type="text"
          maxLength={100}
          autoComplete="name"
          className={inputClass}
        />
        {errorText("name")}
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className="mb-1 block font-mono text-sm text-accent">
          $ email
        </label>
        <input
          {...field("email")}
          type="email"
          maxLength={254}
          autoComplete="email"
          className={inputClass}
        />
        {errorText("email")}
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="mb-1 block font-mono text-sm text-accent">
          $ message
        </label>
        <textarea {...field("message")} rows={5} maxLength={5000} className={inputClass} />
        {errorText("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" />
          {errorText("turnstileToken")}
        </>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-chip border border-accent bg-accent px-4 py-2 font-mono text-sm text-bg hover:bg-transparent hover:text-accent disabled:opacity-60"
        >
          {status === "sending" ? "sending…" : "./send"}
        </button>
        <p role="status" aria-live="polite" className="font-mono text-sm">
          {notice && (
            <span className={status === "sent" ? "text-accent" : "text-highlight"}>{notice}</span>
          )}
        </p>
      </div>
    </form>
  );
}
