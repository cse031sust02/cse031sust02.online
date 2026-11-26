# 010: Second theme, "Mirage" (Islamic heritage × future tech)

## Status
Active

## Feature Doc
docs/features/site-design.md (Themes)

## Goal
Visitors can switch between the existing Terminal design and a second, distinct Mirage design.

## User Story
As a visitor,
I want to switch the site between two very different looks
so that I can see the owner's technical and cultural sides.

## Requirements
- Two themes: `terminal` (default, unchanged) and `mirage`.
- Mirage look: desert night palette (sand, gold, turquoise, terracotta), Islamic geometric star-lattice backdrop, pointed-arch hero scene (dusk sky, crescent, dunes, skyline, rotating rosette, constellation network, data lines), Arabic calligraphy name, serif display type, illuminated card frames, arched product cards, star timeline nodes, golden Arabic-letter matrix rain.
- Switch from a prominent header segmented control (◐ Terminal | ✦ Mirage, active option highlighted; pulsing ring until first use, plus a one-time callout that fades after 12 s and steps aside while the chat or palette is open), the footer, the command palette and the terminal (`theme`, `theme <name>`).
- The choice persists and applies before first paint; unknown stored values fall back to Terminal.
- The full Arabic name (طلحة ابن إمام) comes from `basics.name_arabic` in `profile.yaml` (optional).
- Reduced motion stops all Mirage animation. WCAG AA in both themes.

## Interface
- `web/src/lib/theme/themes.ts`: `THEMES`, `ThemeId`, `DEFAULT_THEME`, `isThemeId`, `nextTheme`, `themeLabel`.
- `web/src/lib/theme/geometry.ts`: `starPoints`, `KHATAM_RATIO`, `seededRandom`, `starField`.
- `NerdProvider` context: `theme`, `setTheme`, `cycleTheme`. `useActiveTheme()` hook.
- Components: `ThemeSwitch` (segmented control + one-time callout, `cse031sust02:theme-tried`), `MirageScene`. Terminal action `{ type: "theme", theme }`. Palette action `cycle-theme`.
- CSS: tokens in `theme.css`, decoration in `styles/themes/mirage.css`, `.theme-terminal` / `.theme-mirage` visibility classes in `globals.css`.

## Acceptance Criteria
- [x] Theme registry validates ids and cycles (unit: `themes.test.ts`).
- [x] Pre-paint script applies a stored valid theme and ignores unknown values (unit: `storage.test.ts`; e2e: `theme.spec.ts`).
- [x] `theme` lists themes, `theme mirage` switches, unknown names are rejected, help lists it (unit: `commands.test.ts`).
- [x] `name_arabic` is optional in the schema (unit: `schema.test.ts`).
- [x] Star geometry and seeded sky are deterministic and correct (unit: `geometry.test.ts`).
- [x] Default is Terminal with the ASCII hero; the header button switches to Mirage, hides ASCII and scanlines, and persists across reload (e2e).
- [x] The terminal command and command palette switch themes (e2e).
- [x] Mirage shows the full calligraphy name from the profile (e2e).
- [x] First visit shows the switch callout; switching or Dismiss hides it for good (e2e).
- [x] No axe WCAG A/AA violations in either theme (e2e: `a11y.spec.ts`).
- [ ] Owner reviews both themes in `npm run dev`.

## Security
- No new dependencies. Fonts are self-hosted by `next/font`, so the CSP is unchanged. Pattern SVGs are `data:` URIs, which the existing `img-src` allows.

## Out of Scope
- A light theme, themed OG image/favicons, per-theme copy changes.

## Open Questions
- Theme name ("Mirage") and default theme: owner to confirm.
