# cse031sust02.online

Personal site of **Talha Ibne Imam** (Engineering Manager, AI SaaS). It's styled as "TalhaOS", a retro terminal: a CV-driven portfolio plus a **Digital Twin** chat powered by OpenRouter.

- All CV and twin facts live in one file: [`web/content/profile.yaml`](web/content/profile.yaml).
- Next.js (App Router) + TypeScript + Tailwind CSS v4, built as a standalone Node server and Docker image, so it runs on any host.

## Repository layout

```
cse031sust02.online/
├── web/                  # the Next.js app (source, config, tests, Dockerfile, content/)
├── docs/                 # features/, decisions/ (ADRs), deployment/
├── specs/                # backlog/ → active/ → completed/
├── tasks/                # task template
├── docker-compose.yml    # local dev in Docker with live reload (mounts ./web, port 3000)
├── AGENTS.md             # rules for coding agents
└── ARCHITECTURE.md       # how the pieces fit together
```

## Quick start

```bash
cd web
cp .env.example .env.local   # optional: add OPENROUTER_API_KEY / SMTP_*
npm install
npm run dev                  # http://localhost:3000
```

Or in Docker with live reload (no rebuild after edits), from the repo root:

```bash
docker compose up            # → http://localhost:3000
```

Full guide: [docs/deployment/local.md](docs/deployment/local.md).

## Checks (from `web/`)

```bash
npm test            # unit tests (Vitest)
npm run test:e2e    # Playwright smoke tests
npm run lint
npm run typecheck
npm run build
```

## How work is done

Spec-driven: feature doc → spec with acceptance criteria → build and verify. See [AGENTS.md](AGENTS.md).
