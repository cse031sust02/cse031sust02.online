# 008: Deployment Guides

## Status
Completed

## Feature Doc
docs/decisions/004-host-agnostic-standalone-docker.md

## Goal
Step-by-step, tested guides to deploy the same build to the owner's chosen host.

> **Update (2026-11-26):** the production guide (`docs/deployment/production.md`) and the Nginx sample config were removed from the repo at the owner's request. The owner maintains deployment guides privately; those paths are git-ignored. Still in the repo: the Dockerfile, `docker-compose.yml`, `docs/deployment/local.md` and the CI workflow (without the `nginx -t` job).
>
> **Update (2026-11-27):** production now deploys on Vercel. The CI workflow, `web/Dockerfile` and `web/.dockerignore` were removed at the owner's request; `docker-compose.yml` (local dev) and `docs/deployment/local.md` remain.

## Requirements
- `docs/deployment/production.md` with sections for:
  - Hostinger VPS (Docker, or PM2 + Nginx + Let's Encrypt), and Hostinger Node.js hosting.
  - AWS: EC2/Lightsail (Docker + Nginx), App Runner (container), Amplify.
  - Vercel.
- Nginx sample config with `proxy_buffering off` for `/api/chat` and correct `X-Forwarded-For`.
- Env var checklist per host. Post-deploy smoke checklist.
- Optional GitHub Actions CI: lint, typecheck, test, build, Docker build.

## Acceptance Criteria
- [x] The Docker image built per the guide runs locally and passes the Playwright smoke test against it. _(Hostinger Docker steps 3–5 with the localhost override; `smoke.spec.ts` + `seo.spec.ts` passed against it.)_
- [x] The Nginx sample config passes `nginx -t` (in a container). _(`docs/deployment/nginx/test-config.sh`.)_
- [x] CI workflow (if added) passes on a clean clone. _(All `checks` job steps run locally on a fresh clone; the workflow itself runs on the first push to GitHub.)_
- [ ] The owner deploys to the chosen host following the guide, without extra steps. _(Owner action.)_

## Out of Scope
- Infrastructure-as-code, autoscaling.

## Open Questions
- Which host first? _(Still open. The guide covers all of them; Hostinger VPS + Docker is listed first as the recommended path.)_
