# Local Development

The app lives in `web/`. Run npm commands there; run Docker from the repo root.

## Prerequisites
- Node.js 22+ and npm
- (Optional) Docker Desktop, for a production-like run

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
Open http://localhost:3000.

## Run (production build, no Docker)
```bash
cd web
npm run build
npm start
```

## Run (Docker, closest to production)
```bash
# from the repo root; reads env vars from web/.env
docker compose up --build
```
Open http://localhost:3000.

## Checks (from `web/`)
```bash
npm test            # unit tests
npm run test:e2e    # Playwright smoke tests (starts the app)
npm run lint
npm run typecheck
```

## Without keys
- Without `OPENROUTER_API_KEY`, the site works and the twin shows "twin offline".
- Without `SMTP_*`, the contact form shows "contact temporarily unavailable".
