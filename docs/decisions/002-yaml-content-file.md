# ADR 002: A single YAML file for all content

## Status
Accepted

## Context
The owner wants to update CV content over time without editing code, and the Digital Twin must use the same facts as the page.

## Decision
Store all content in `web/content/profile.yaml`, validated with zod when it loads.

## Reasons
- YAML is readable and supports comments.
- A single source of truth means the page and twin can't drift apart.
- zod gives clear build-time errors instead of broken pages.

## Alternatives considered
- TypeScript data file: typed, but less friendly to edit.
- Headless CMS / database: overkill for one author.

## Consequences
- Content changes need a redeploy.
- The file is public, so it must never contain private data.
