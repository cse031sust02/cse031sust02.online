# Content (`web/content/profile.yaml`)

All CV and Digital Twin knowledge lives in one owner-editable YAML file. The site sections and the twin's system prompt are both generated from it, so editing the file and redeploying updates everything.

## Flow
1. Owner edits `web/content/profile.yaml`.
2. At build/server time, `web/src/lib/content` parses it and validates it with a zod schema.
3. Pages render sections from the typed `Profile`; the twin builds its system prompt from the same object.

## Structure
`basics`, `stats`, `links`, `experience`, `products`, `skills`, `education`, `certifications`, `awards`, and `twin_notes` (twin-only knowledge: philosophy, interests, FAQs; not shown on the page).

## Rules
- The file is public (it ships in the repo): **no phone number, email address, or private data**.
- Invalid content (typo, missing field, bad date) fails `npm run build` with a readable error naming the field.
- Dates are `YYYY-MM`; `end: present` for ongoing items.
- The twin may only state facts found in this file.
- Unknown keys (e.g. a typo like `hightlights`) are rejected, except inside `twin_notes`, where any extra text or list-of-text key is allowed.

## Code
- `web/src/lib/content/schema.ts`: zod schema and `Profile` types.
- `web/src/lib/content/load-profile.ts`: `getProfile()` (server-only, cached per process).
- `web/src/lib/content/dates.ts`: `formatDateRange("2021-01", "present")` → `Jan 2021 – Present`.
- `web/src/lib/content/privacy.ts`: rejects strings that look like an email address or phone number.

Example error from `npm run build`:
```
Invalid content in content/profile.yaml:
  • experience[1].start: expected YYYY-MM
```

## Spec
[002-content-model](../../specs/completed/002-content-model.md)
