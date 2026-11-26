# ADR 006: Keep the app in `web/`, docs at the root

## Status
Accepted

## Context
The owner wants documentation and specs clearly separated from source code. A Next.js project at the root scatters about 10 config files among the docs.

## Decision
The entire Next.js project (source, config, tests, Dockerfile, env files, `content/`) lives in `web/`. The root holds only docs, specs, tasks, agent rules and `docker-compose.yml`.

## Reasons
- A clean root: docs and specs are easy to find and review.
- The app is self-contained, so it's easy to build, containerize or move.
- `content/` stays inside `web/` because the build reads it. This avoids file-tracing and Docker-context issues with paths outside the app.

## Consequences
- npm commands run from `web/` (`cd web`).
- Vercel needs "Root Directory" set to `web`. Other hosts deploy `web/` or the Docker image.
- `.env` / `.env.local` live in `web/`.
