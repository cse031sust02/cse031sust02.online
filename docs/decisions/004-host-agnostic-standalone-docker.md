# ADR 004: Host-agnostic deployment (standalone Node + Docker)

## Status
Accepted

## Context
The owner may deploy to Hostinger, AWS or Vercel and wants to run everything locally first.

## Decision
Build with `output: 'standalone'`, keep the whole app in `web/` with its multi-stage `web/Dockerfile`, add a root `docker-compose.yml` (build context `./web`), and use only the Node runtime with no vendor-specific APIs.

## Reasons
- The same artifact runs locally, on a VPS (Hostinger/EC2/Lightsail), on containers (App Runner/ECS), or on Vercel.
- Docker Compose gives a production-like local run.

## Consequences
- Static export and Node-less shared hosting are not supported (chat needs a server).
- Vercel needs "Root Directory" set to `web`.
- Reverse proxies must disable buffering for `/api/chat`.
- The in-memory rate limit is per instance; use Redis if scaled out.
