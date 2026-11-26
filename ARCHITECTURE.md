# ARCHITECTURE.md

## Overview

A Next.js (App Router) site that runs as a single Node server. Pages are mostly static Server Components rendered from one content file. Two server-only API routes handle the dynamic parts: the Digital Twin chat and the contact form. There is no database.

```
              web/content/profile.yaml  (owner-editable, public)
                          │  loaded + validated (zod) at build/server time
            ┌─────────────┴──────────────┐
            v                            v
   Page sections (RSC)          Twin system prompt
   src/components/sections      src/lib/twin/system-prompt.ts
                                         │
Browser ── POST /api/chat ──> route.ts ──┴─> lib/twin/openrouter.ts ──> OpenRouter
        <── streamed tokens ──┘   (validate, rate-limit)

Browser ── POST /api/contact ─> route.ts ──> lib/contact/mailer.ts ──> SMTP
                                  (validate, honeypot, rate-limit)
```

## Repository Layout

Docs and process live at the root. The whole app lives in `web/` ([ADR 006](docs/decisions/006-app-in-web-folder.md)).

```
cse031sust02.online/
├── AGENTS.md  CLAUDE.md  ARCHITECTURE.md  README.md
├── docker-compose.yml        # build context ./web
├── docker-compose.dev.yml    # dev server in Docker, mounts ./web (live reload)
├── .github/workflows/ci.yml  # lint, typecheck, tests, build + secret check, e2e, Docker
├── docs/                     # features/, decisions/, deployment/
├── specs/                    # backlog/, active/, completed/, template.md
├── tasks/                    # template.md
└── web/                      # the Next.js app
    ├── package.json  next.config.ts  tsconfig.json  (lint/test configs)
    ├── Dockerfile  .dockerignore
    ├── .env.example          # .env / .env.local live here (git-ignored)
    ├── content/profile.yaml
    ├── public/
    ├── e2e/                  # Playwright smoke tests
    └── src/
        ├── app/              # layout, page, twin/, api/chat, api/contact, api/health, OG, sitemap, robots
        ├── components/       # sections/, terminal/, twin/, boot/, hero/, ui/, layout/
        ├── config/           # nav.ts: nav items shared by header, palette, sitemap
        ├── lib/              # content/, twin/, contact/, rate-limit.ts
        └── styles/           # theme.css, globals.css
```

## Layers (paths relative to `web/`)

| Layer | Location | Responsibility |
|---|---|---|
| Content | `content/profile.yaml` | All CV + twin facts. Single source of truth. |
| Content loader | `src/lib/content/` | Parse YAML, validate with zod, export typed `Profile`. |
| Pages / layout | `src/app/**` | Routing, metadata, composition. |
| Components | `src/components/**` | Presentation. Client components only where interactive. |
| Route handlers | `src/app/api/**/route.ts` | HTTP in/out, validation, rate limiting. |
| Lib | `src/lib/**` | Logic and integrations (OpenRouter, SMTP). |
| Theme | `src/styles/theme.css` | Design tokens (colors, fonts, effects). |

## Key Decisions

See [docs/decisions/](docs/decisions/).

## Features

See [docs/features/](docs/features/). Build order lives in `specs/`.
