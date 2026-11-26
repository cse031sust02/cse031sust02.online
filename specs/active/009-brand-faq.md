# 009: "Why cse031sust02?" brand FAQ

## Status
Active

## Feature Doc
docs/features/digital-twin.md

## Goal
Visitors can tap a suggested question to learn the story behind the cse031sust02 handle.

## User Story
As a visitor,
I want to ask the AI Agent why the brand is "cse031sust02"
so that I understand the handle and get a feel for the owner's personality.

## Requirements
- The story lives in `web/content/profile.yaml` as the first `twin_notes.faq` entry (no hard-coded facts).
- The first FAQ question is always the first suggested chip (home teaser and chat).
- 3 chips are shown: the pinned FAQ question plus 2 random picks from a pool of 10 questions.
- The shuffle happens in the browser after hydration (fresh on each load, no hydration mismatch).
- Suggested chips show only before the first question; no follow-up chips after answers.
- The agent answers FAQ questions from the pre-written answer, without adding facts.

## Interface
- `suggestedPrompts(profile)` → `{ pinned, pool }` and `orderPrompts(set, random?)` in `web/src/lib/twin/suggested-prompts.ts`.
- `TwinProvider` props `prompts` (pool) + `pinnedPrompts`; context exposes `prompts` (3 shown) and `allPrompts`.
- New `FAQ` rule in `buildRules` (`web/src/lib/twin/system-prompt.ts`).

## Acceptance Criteria
- [x] `profile.yaml` has a FAQ entry explaining CSE (department), 031 (roll number), SUST (university), 02 (2002 batch) and the name-collision reason.
- [x] The first FAQ question is pinned (unit test); with no FAQ, nothing is pinned (unit test).
- [x] The pool has 10 unique questions, including the first product (unit test).
- [x] Ordering keeps pinned first and shuffles every pool question exactly once (unit test).
- [x] 3 chips are shown (`SHOWN_PROMPTS`).
- [x] No suggestion chips appear after an answer (e2e: `twin.spec.ts`).
- [x] The system prompt includes the FAQ rule (unit test).
- [ ] Owner checks the chip and the answer in `npm run dev`.

## Security
- No contact details added. Answer contains only owner-provided facts.

## Out of Scope
- Showing FAQ entries as a page section.

## Open Questions
- None.
