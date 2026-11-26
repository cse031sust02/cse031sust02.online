# Contact Form

Visitors contact Talha through a form. No email address or phone number is ever shown on the site.

## Flow
1. Visitor fills in name, email and message in a terminal-styled form.
2. `POST /api/contact` validates the input, checks the honeypot and timing, and rate-limits.
3. The server sends an email over SMTP to `CONTACT_TO_EMAIL`, with `Reply-To` set to the visitor's email.
4. The visitor sees a success or error message.

## Rules
- The destination address lives only in env vars.
- Spam protection: hidden honeypot, minimum time-to-submit (3 s), 3 submissions per IP per 10 min, length limits. Optional Cloudflare Turnstile when `TURNSTILE_SECRET_KEY` is set.
- If SMTP isn't configured, the endpoint returns 503 and the UI says so. Messages are never silently dropped.

## Code
- `web/src/lib/contact/schema.ts`: zod schema shared by the form and the route.
- `web/src/lib/contact/mailer.ts`: SMTP config from env (`getMailConfig`), nodemailer transport, header-safe subject.
- `web/src/lib/contact/turnstile.ts`: optional Cloudflare Turnstile verification.
- `web/src/app/api/contact/route.ts`: rate limit, validation, honeypot/timing (bots get `200 { ok: true }` and nothing is sent), Turnstile, send.
- `web/src/components/contact/ContactForm.tsx`: terminal-styled form with inline errors. The terminal `contact` command and the palette entry scroll to it and focus the name field.

## Env
`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (defaults to `SMTP_USER`), `CONTACT_TO_EMAIL`, optional `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. See `web/.env.example`.

Provider examples:
- Gmail: `smtp.gmail.com`, port 465 + `SMTP_SECURE=true`, with an app password.
- Hostinger: `smtp.hostinger.com`, port 465 + `SMTP_SECURE=true`.
- AWS SES: `email-smtp.<region>.amazonaws.com`, port 587, SMTP credentials from the SES console.

`npm run check:secrets` also fails if `CONTACT_TO_EMAIL` or SMTP secrets appear in client bundles or prerendered HTML.

## Decision
[005-smtp-contact-form](../decisions/005-smtp-contact-form.md)

## Spec
[006-contact-form](../../specs/completed/006-contact-form.md)
