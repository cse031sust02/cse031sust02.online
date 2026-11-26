# 007: SEO & Polish

## Status
Completed

## Goal
The site is discoverable, shareable and polished before deployment.

## Requirements
- Metadata (title template, description, canonical) from `NEXT_PUBLIC_SITE_URL` + profile.
- Generated OG image (`opengraph-image.tsx`) in terminal style.
- JSON-LD `Person` (name, jobTitle, sameAs = links; no email/phone).
- `sitemap.ts`, `robots.ts`, favicon/app icons, custom `not-found` ("404: command not found").
- Security headers (CSP allowing only required origins, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Final accessibility and performance pass.

## Acceptance Criteria
- [x] `/sitemap.xml` and `/robots.txt` return valid content with the site URL.
- [x] `/opengraph-image` returns a 1200×630 PNG.
- [x] The JSON-LD `Person` is present on `/` and contains no email/phone.
- [x] An unknown route renders the custom 404 with status 404.
- [x] Security headers are present on `/` (Playwright).
- [ ] Lighthouse (mobile, local prod build): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. _(Owner to run: Lighthouse couldn't run in the build session. Covered meanwhile: axe-core WCAG A/AA e2e = 0 violations; SEO basics (title, description, canonical, robots, sitemap, valid JSON-LD, lang, viewport) are e2e-tested; no console errors under the CSP.)_

## Out of Scope
- Analytics (decide later).

## Open Questions
- Downloadable CV: the current PDF contains phone, email and WhatsApp. Skip the button, or provide a public PDF without contact details? _(Decision for now: no download button. The site never publishes contact details. If the owner provides a redacted PDF, add it to `web/public/` and link it from the hero.)_
