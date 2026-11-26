# ADR 001: Use Next.js (App Router)

## Status
Accepted

## Context
The site is mostly static content, plus two small server endpoints (streaming chat, contact form). The owner requested Next.js.

## Decision
Use Next.js with the App Router, React Server Components and TypeScript.

## Reasons
- Static sections render on the server: fast and SEO-friendly.
- Route Handlers cover the API needs without a separate backend.
- Streaming responses work natively.

## Consequences
- Needs a Node server at runtime (see ADR 004). Static-only hosting is not enough.
