# AGENTS.md

## Project

**cse031sust02.dev**: personal website of Talha Ibne Imam (Engineering Manager, AI SaaS). It has a nerdy "TalhaOS" terminal look, a CV-driven portfolio, and a **Digital Twin** chat powered by OpenRouter.

The work is spec-driven: see [Workflow](#workflow). Overview: [ARCHITECTURE.md](ARCHITECTURE.md).

## Repository Layout

- **`web/`**: the entire Next.js app (source, config, tests, `Dockerfile`, `.env*`, `content/`). **All app code lives here.**
- Root: docs and process only: `docs/`, `specs/`, `tasks/`, `AGENTS.md`, `ARCHITECTURE.md`, `README.md`, `docker-compose.yml`.
- Never put app code or app config at the root.

## Tech Stack

- Node.js 22+ (LTS), npm
- Next.js (App Router), React, TypeScript (strict)
- Tailwind CSS v4, Framer Motion
- zod (validation), `yaml` (content)
- OpenRouter (LLM), nodemailer (SMTP contact form)
- Vitest + Testing Library (unit), Playwright (e2e smoke)
- ESLint + Prettier
- Docker (`output: 'standalone'`): host-agnostic

## Architecture Rules

- **Content:** all CV and twin facts live in `web/content/profile.yaml`. Never hard-code them in components or prompts.
- **Components:** `web/src/components/**` handle presentation only. Server Components by default; add `"use client"` only for interactivity.
- **Route handlers:** `web/src/app/api/**/route.ts` handle HTTP only: parse, validate (zod), call `lib`, respond.
- **Lib:** `web/src/lib/**` holds logic (content loading, twin prompt, OpenRouter client, mailer, rate limiting). Pure and unit-testable.
- **Theme:** design tokens live only in `web/src/styles/theme.css`. The design is provisional and must stay re-themeable.
- **Portability:** Node runtime only. No vendor-specific APIs (`@vercel/*`, Edge-only features).

## Commands

Run npm commands from `web/`. Run Docker from the repo root.

```
Install:        cd web && npm install
Dev server:     npm run dev            # http://localhost:3000
Unit tests:     npm test
One test:       npx vitest run src/lib/content/schema.test.ts
E2E smoke:      npm run test:e2e
Lint:           npm run lint
Format:         npm run format
Type check:     npm run typecheck
Prod build:     npm run build && npm start
Docker (local): docker compose up --build   # from repo root
```

## Development Rules

1. Read the relevant spec in `specs/active/` (and its feature doc) before implementing.
2. Work on **one spec at a time**. Don't start the next until the owner approves the current one.
3. Inspect existing patterns before creating new ones.
4. Add tests for new behavior: one or more per acceptance criterion.
5. Don't modify unrelated files. Don't add dependencies without justification.
6. **Privacy:** never put a phone number or email address in the repo, content or UI. Never read, print or commit `.env` / `.env.local`. Secrets are server-only (no `NEXT_PUBLIC_` prefix).
7. Never fabricate experience, metrics or claims not in `web/content/profile.yaml`.
8. Update docs (`docs/`, `ARCHITECTURE.md`) when behavior or architecture changes.
9. Commit only when the owner asks.

## Workflow

| Step | Output |
|---|---|
| Discuss design (no code) | Agreed design |
| Feature doc | `docs/features/*.md` |
| Decision record (when non-obvious) | `docs/decisions/NNN-*.md` |
| Spec with testable acceptance criteria | `specs/active/NNN-*.md` (queued specs wait in `specs/backlog/`) |
| Build & verify | Code + tests; spec moves to `specs/completed/` |

Templates: [specs/template.md](specs/template.md), [tasks/template.md](tasks/template.md).

## Definition of Done

A spec is complete only when:
- All acceptance criteria are satisfied and checked off in the spec.
- Tests are added and `npm test` passes.
- `npm run lint`, `npm run typecheck` and `npm run build` pass.
- The feature works locally via `npm run dev` and the owner has reviewed it.
- Docs are updated where necessary.
- The spec is moved to `specs/completed/` with status `Completed`.
