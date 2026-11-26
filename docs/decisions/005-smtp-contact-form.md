# ADR 005: Contact form over SMTP; no public email

## Status
Accepted

## Context
The owner doesn't want an email address or phone number on the site, but visitors need a way to make contact.

## Decision
Use a contact form whose server route sends mail with `nodemailer` over SMTP. The recipient address lives only in env vars.

## Reasons
- SMTP works with any provider (Gmail app password, Hostinger mail, AWS SES).
- No third-party form service, no vendor lock-in.

## Alternatives considered
- Resend/Formspree: easy, but another vendor and account.
- Obfuscated `mailto:`: still exposes the address.

## Consequences
- Requires SMTP credentials in each environment.
- Needs spam protection (honeypot, timing, rate limit, optional Turnstile).
