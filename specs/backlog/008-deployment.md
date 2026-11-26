# 008: Deployment Guides

## Status
Backlog

## Feature Doc
docs/decisions/004-host-agnostic-standalone-docker.md

## Goal
Step-by-step, tested guides to deploy the same build to the owner's chosen host.

## Requirements
- `docs/deployment/production.md` with sections for:
  - Hostinger VPS (Docker, or PM2 + Nginx + Let's Encrypt), and Hostinger Node.js hosting.
  - AWS: EC2/Lightsail (Docker + Nginx), App Runner (container), Amplify.
  - Vercel.
- Nginx sample config with `proxy_buffering off` for `/api/chat` and correct `X-Forwarded-For`.
- Env var checklist per host. Post-deploy smoke checklist.
- Optional GitHub Actions CI: lint, typecheck, test, build, Docker build.

## Acceptance Criteria
- [ ] The Docker image built per the guide runs locally and passes the Playwright smoke test against it.
- [ ] The Nginx sample config passes `nginx -t` (in a container).
- [ ] CI workflow (if added) passes on a clean clone.
- [ ] The owner deploys to the chosen host following the guide, without extra steps.

## Out of Scope
- Infrastructure-as-code, autoscaling.

## Open Questions
- Which host first?
