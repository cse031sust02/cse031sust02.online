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

## Decision
[005-smtp-contact-form](../decisions/005-smtp-contact-form.md)

## Spec
[006-contact-form](../../specs/backlog/006-contact-form.md)
