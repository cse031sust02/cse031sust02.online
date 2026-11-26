# Local Development

The app lives in `web/`. Run npm commands there; run Docker from the repo root.

## Prerequisites
- Node.js 22+ and npm
- (Optional) Docker Desktop, for live-reload dev in a container or a production-like run

## Setup
```bash
cd web
cp .env.example .env.local   # then fill in OPENROUTER_API_KEY (and SMTP_* for the contact form)
npm install
```

## Run (dev, hot reload)
```bash
cd web
npm run dev
```
Open http://localhost:3000. Code, styles and `content/profile.yaml` changes show up without a restart (the profile is re-read on each request in dev only).

## Run (Docker, dev with live reload)
```bash
# from the repo root
docker compose -f docker-compose.dev.yml up
DEV_PORT=3200 docker compose -f docker-compose.dev.yml up   # if port 3000 is taken by something else
```
Mounts `web/` into a `node:22-alpine` container running `npm run dev`, so edits under `web/` show up without a rebuild. Env vars come from `web/.env` / `web/.env.local` (Next.js reads them from the mounted folder). Linux `node_modules` and `.next` live in Docker volumes, separate from your Mac's; `npm ci` runs again only when `package-lock.json` changes. Reset them with `docker compose -f docker-compose.dev.yml down -v`.

## Run (production build, no Docker)
```bash
cd web
npm run build   # also copies static assets + content next to the standalone server
npm start       # node .next/standalone/server.js, loads .env / .env.local
```
Set `PORT` to change the port (default 3000).

## Run (Docker, closest to production)
```bash
# from the repo root; reads env vars from web/.env
docker compose up --build
```
Open http://localhost (host port 80 → port 3000 inside the container). This is a built snapshot: rebuild (`--build`) after any change.

## Checks (from `web/`)
```bash
npm test            # unit tests
npm run test:e2e    # Playwright smoke tests (builds and starts the app on port 3100)
E2E_BASE_URL=http://localhost npx playwright test   # against an already-running server (e.g. the Docker prod container)
npm run lint
npm run typecheck
```

## Without keys
- Without `OPENROUTER_API_KEY`, the site works and the twin shows "twin offline".
- Without `SMTP_*`, the contact form shows "contact temporarily unavailable".
