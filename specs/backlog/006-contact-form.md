# 006: Contact Form

## Status
Backlog

## Feature Doc
docs/features/contact-form.md

## Goal
Visitors can message Talha without the site revealing any email address.

## Requirements
- Terminal-styled form: name (≤100), email (valid), message (10–5000), hidden honeypot, hidden render timestamp.
- `web/src/lib/contact/mailer.ts`: nodemailer SMTP transport from env; `Reply-To` = visitor email; subject `[cse031sust02.dev] Message from <name>`.
- `POST /api/contact` (Node runtime): zod-validate, honeypot/timing checks, rate limit 3 per IP per 10 min, optional Turnstile verification.
- The terminal `contact` command and palette entry scroll to and focus the form.

## Interface
```
POST /api/contact
  body: { name, email, message, website /*honeypot*/, renderedAt, turnstileToken? }
  200:  { ok: true }
  400:  { error: "invalid_request", fields?: {...} }
  429:  { error: "rate_limited" }
  503:  { error: "contact_unavailable" }   // SMTP not configured or send failed
```

## Acceptance Criteria
- [ ] A valid submission calls the mailer once with `to = CONTACT_TO_EMAIL` and `replyTo = visitor email` (mocked transport).
- [ ] Invalid fields → 400 with per-field errors, shown inline in the UI.
- [ ] A filled honeypot → 200 `{ ok: true }` but no email is sent.
- [ ] A submission sooner than 3 s after render → no email is sent.
- [ ] The 4th submission in 10 min from one IP → 429.
- [ ] SMTP env missing → 503; the UI shows "contact temporarily unavailable".
- [ ] When `TURNSTILE_SECRET_KEY` is set, a missing/invalid token → 400.
- [ ] `CONTACT_TO_EMAIL` never appears in rendered HTML or client bundles.
- [ ] Manual: a real email arrives locally with the configured SMTP.

## Out of Scope
- Storing messages, auto-replies, newsletters.

## Open Questions
- SMTP provider: Gmail app password, Hostinger mail or AWS SES?
