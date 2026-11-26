# 001: Project Scaffold & Local Run

## Status
Completed

## Feature Doc
ARCHITECTURE.md, docs/deployment/local.md, docs/decisions/006-app-in-web-folder.md

## Goal
A runnable Next.js project with tooling, theme tokens and Docker, so every later spec builds on a working, verifiable base, locally first.

## User Story
As the owner,
I want to run the site locally with one command (with or without Docker)
so that I can review each feature before deploying anywhere.

## Requirements
- The whole Next.js project lives in **`web/`**; the root keeps only docs/process files plus `docker-compose.yml`.
- Next.js (latest stable, App Router) + React + TypeScript strict, `web/src/` layout, `@/*` import alias.
- Tailwind CSS v4; `web/src/styles/theme.css` defines design tokens (colors, fonts, radii, glow) as CSS variables; Tailwind reads from them.
- Fonts via `next/font`: JetBrains Mono + one sans body font.
- ESLint (Next config) + Prettier; npm scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck`, `test`, `test:e2e`.
- Vitest + Testing Library configured; Playwright configured with one smoke test.
- `next.config` uses `output: 'standalone'`.
- Multi-stage `web/Dockerfile` (Node LTS Alpine, non-root user, `PORT` default 3000) and `web/.dockerignore`; root `docker-compose.yml` (one `web` service, `build: ./web`, `env_file: web/.env`, port 3000).
- Placeholder home page in the TalhaOS style: a window card that shows `talha@cse031sust02:~$ booting…`. It proves the tokens and fonts work.
- `/api/health` returns `{ "status": "ok" }`.
- `web/.env.example` documents all env vars from the specs (OpenRouter, site URL, SMTP, contact, Turnstile).
- Root `README.md` with project overview, repo layout and quick start (links to `docs/deployment/local.md`).

## Interface
```
GET /api/health  →  200 { "status": "ok" }
```

## Acceptance Criteria
- [x] `cd web && npm install && npm run dev` serves the placeholder page at http://localhost:3000.
- [x] `npm run build && npm start` (in `web/`) serves the same page.
- [x] `docker compose up --build` (from the repo root) serves the same page at http://localhost:3000, running as a non-root user.
- [x] `GET /api/health` returns 200 `{ "status": "ok" }` (unit test on the route handler).
- [x] Changing one color variable in `web/src/styles/theme.css` changes the placeholder's accent color (manual check).
- [x] `npm run lint`, `npm run typecheck`, `npm test` and `npm run test:e2e` all pass.
- [x] The Playwright smoke test loads `/` and asserts the page title and the prompt text.
- [x] `web/.env`, `web/.env.local`, `node_modules`, `.next` are git-ignored; `web/.env.example` is not.
- [x] No app source or app config files exist at the repo root (only docs/process files, `docker-compose.yml`, `.gitignore`).

## Security
- No secrets in the image: env vars are injected at runtime, never `COPY`'d.

## Out of Scope
- Real sections, content loading, twin, contact form, animations.
