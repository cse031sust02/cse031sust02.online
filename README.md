# cse031sust02.dev

Personal site of **Talha Ibne Imam** (Engineering Manager, AI SaaS). It's styled as "TalhaOS", a retro terminal: a CV-driven portfolio plus a **Digital Twin** chat powered by OpenRouter.

- All CV and twin facts live in one file: [`web/content/profile.yaml`](web/content/profile.yaml).
- Next.js (App Router) + TypeScript + Tailwind CSS v4, built as a standalone Node server and Docker image, so it runs on any host.

## Repository layout

```
cse031sust02.dev/
├── web/                  # the Next.js app (source, config, tests, Dockerfile, content/)
├── docs/                 # features/, decisions/ (ADRs), deployment/
├── specs/                # backlog/ → active/ → completed/
├── tasks/                # task template
├── docker-compose.yml    # production-like local run (build context ./web)
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

Production-like run with Docker, from the repo root:

```bash
docker compose up --build    # reads web/.env if present
```

Full guide: [docs/deployment/local.md](docs/deployment/local.md). Deploying (Hostinger, AWS, Vercel): [docs/deployment/production.md](docs/deployment/production.md).

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
