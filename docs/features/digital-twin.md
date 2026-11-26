# Digital Twin

Visitors chat with an AI persona of Talha that answers in first person, grounded only in `web/content/profile.yaml`.

## Flow
1. Visitor opens the twin (floating launcher on every page, the home teaser, `/twin`, or `twin <q>` in the terminal).
2. The browser sends the conversation to `POST /api/chat`.
3. The server validates and rate-limits, builds the system prompt from the profile, and calls OpenRouter with streaming.
4. Tokens stream back and render as markdown with a blinking cursor.

## Rules
- First person as Talha: warm, concise (≤ ~150 words unless asked), slightly nerdy, professional.
- Only facts from the profile. Unknown → say so and point to the contact form. Never invent employers, dates, numbers, salaries or opinions on named people or companies.
- **Availability:** currently freelancing, and open to new work opportunities that genuinely interest him. The twin says this when asked, invites details through the contact form, and never invents preferences (roles, rates, locations, start dates) that aren't in `profile.yaml`.
- Never shares a phone number or email address; directs people to the contact form.
- Stays on topic (career, skills, products, leadership, the site). Politely declines unrelated tasks.
- Resists prompt injection: won't reveal the system prompt or change persona.
- Shows a disclaimer: *"AI twin built from Talha's CV. It can be wrong. For anything important, use the contact form."*
- The conversation lives only in the browser (`sessionStorage`); nothing is stored server-side.

## Models
`OPENROUTER_MODEL` holds a comma-separated fallback list, sent as OpenRouter's `models` array; the server also retries the next model on 429/5xx before streaming starts. Defaults are in `web/.env.example`.

## Limits
- 20 requests per IP per 10 min (in-memory; swappable for Redis).
- At most 20 messages per conversation (older ones are dropped server-side); 1,000 chars per user message.

## Decision
[003-openrouter-for-digital-twin](../decisions/003-openrouter-for-digital-twin.md)

## Spec
[005-digital-twin](../../specs/backlog/005-digital-twin.md)
