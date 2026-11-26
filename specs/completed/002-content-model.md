# 002: Content Model (`profile.yaml` loader)

## Status
Completed

## Feature Doc
docs/features/content.md

## Goal
Load `web/content/profile.yaml` into a validated, typed `Profile` that pages and the twin share.

## User Story
As the owner,
I want to edit one YAML file and get a clear error if I make a mistake
so that I can keep my CV current without touching code.

## Requirements
- zod schema in `web/src/lib/content/schema.ts` covering every top-level key in `profile.yaml`.
- `getProfile()` in `web/src/lib/content/load-profile.ts`: reads, parses, validates and caches for the process lifetime; server-only.
- Dates: `YYYY-MM` or `present`; years as numbers. Helper to format date ranges ("Jan 2021 – Aug 2026").
- Validation errors name the path, e.g. `experience[1].start: expected YYYY-MM`.
- A privacy guard fails validation if any string looks like an email address or phone number.

## Interface
```ts
getProfile(): Profile
formatDateRange(start, end): string
```

## Acceptance Criteria
- [x] The current `web/content/profile.yaml` validates successfully.
- [x] A missing required field fails with an error naming the field path.
- [x] An invalid date (e.g. `2021-13`) fails with an error naming the field path.
- [x] A string containing an email address or a phone-number-like pattern fails validation.
- [x] `formatDateRange('2021-01', '2026-08')` → `Jan 2021 – Aug 2026`; `end: present` → `… – Present`.
- [x] `npm run build` fails when `profile.yaml` is invalid.
- [x] `getProfile` cannot be imported into a client component (`server-only`).

## Out of Scope
- Rendering sections (003), the twin prompt (005).
