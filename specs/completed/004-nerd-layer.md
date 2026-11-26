# 004: Nerd Layer (interactions & effects)

## Status
Completed

## Feature Doc
docs/features/site-design.md

## Goal
Add the memorable TalhaOS interactions without hurting accessibility or performance.

## Requirements
- Boot sequence: first visit only, ~1.5 s, skippable (click/any key), remembered in `localStorage`.
- ASCII-art name + typewriter tagline in the hero.
- Hero background canvas (matrix rain or particle grid); pauses when off-screen or the tab is hidden.
- CRT scanline overlay, toggleable.
- Command palette (`⌘K`/`Ctrl+K`): fuzzy search over sections and commands.
- Interactive terminal: `help`, `whoami`, `ls products`, `cat experience`, `skills --tree`, `contact`, `clear`, `twin <q>` (stub until 005), `sudo make-coffee`, `rm -rf /` (joke), unknown → `command not found`. Command history with ↑/↓.
- Konami code toggles matrix mode.
- Command output text comes from `getProfile()`, not hard-coded.

## Acceptance Criteria
- [x] The boot sequence shows on the first visit, not on reload, and is skippable by key or click.
- [x] With `prefers-reduced-motion: reduce`, boot, typewriter, canvas animation and scanlines are disabled (Playwright emulation).
- [x] `⌘K`/`Ctrl+K` opens the palette; Esc closes it; selecting a section scrolls to it.
- [x] Each terminal command produces its expected output (unit tests on the command parser).
- [x] An unknown command prints `command not found: <cmd>`.
- [x] ↑/↓ cycles command history.
- [x] The canvas animation stops when the tab is hidden (unit test on the visibility handler).
- [ ] Lighthouse performance ≥ 90 (mobile) on `/` locally. _(Not measured: running Lighthouse was blocked in the build session. The page is statically prerendered, has no animation libraries (CSS only, no Framer Motion), and the canvas is capped at 20 fps and pauses off-screen. The owner should run Lighthouse to confirm.)_

## Out of Scope
- The real twin connection (005), theme switcher UI beyond the CRT toggle.
