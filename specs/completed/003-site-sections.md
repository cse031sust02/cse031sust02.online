# 003: Site Sections (static)

## Status
Completed

## Feature Doc
docs/features/site-design.md

## Goal
Render every home section from `getProfile()` in the TalhaOS style, without the heavy effects yet.

## User Story
As a visitor (recruiter, founder, engineer),
I want to scan Talha's experience, products and skills quickly
so that I understand who he is in under a minute.

## Requirements
- Layout: nav (section anchors, from a config list), main, footer.
- `WindowCard` UI component (title bar, traffic-light dots).
- Sections: Hero, About (+ status + stats), Experience (git-log timeline, expandable), Products (repo cards with external links), Skills (tree), Twin teaser (placeholder button until 005), Credentials, Contact (placeholder until 006), Footer.
- Nav items come from a config array, so `/blog` and `/lab` can be added later.
- Responsive from 360px; semantic landmarks; keyboard-accessible expand/collapse.
- External links open in a new tab with `rel="noopener noreferrer"`.

## Acceptance Criteria
- [x] Every experience entry, product, skill group, education item and certification in `profile.yaml` appears on the page (test renders sections with a fixture profile).
- [x] Adding an experience entry to the fixture adds a timeline item, with no component change.
- [x] Products and certifications link to their `url`s.
- [x] No email address or phone number appears in the rendered HTML (test).
- [x] Experience items expand and collapse with mouse and keyboard (Enter/Space), with `aria-expanded` set correctly.
- [x] No horizontal scroll at 360px width (Playwright).
- [x] Lighthouse accessibility ≥ 95 on `/` locally. _(Automated equivalent: `e2e/a11y.spec.ts` runs axe-core, the engine behind Lighthouse's accessibility score, and reports 0 WCAG A/AA violations. A Lighthouse run itself is left to the owner.)_

## Out of Scope
- Boot sequence, matrix background, terminal, palette (004); twin (005); form (006).

## Open Questions
- EnergyMeta links to a YouTube video in the CV. Is that the product demo? _(Still open: the link is kept as-is, with the TODO in `profile.yaml`.)_
