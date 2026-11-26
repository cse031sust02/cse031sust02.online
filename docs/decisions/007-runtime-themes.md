# ADR 007: Runtime themes via `html[data-theme]` and CSS-switched markup

## Status
Accepted

## Context
The owner wants a second, completely different look ("Mirage": Islamic heritage × future tech) next to the existing terminal design, switchable by visitors. Some differences are colour only, but others change markup: the hero art (ASCII name + matrix rain vs. an arch scene + Arabic calligraphy) and the section eyebrow (`$ command` vs. ornamental numerals).

## Decision
- The active theme is an attribute on `<html>`: no attribute = `terminal` (default), `data-theme="mirage"` = Mirage. Theme ids live in `web/src/lib/theme/themes.ts`.
- The choice is stored in `localStorage` (`cse031sust02:theme`) and applied by the existing pre-paint script before first paint.
- Tokens per theme live in `web/src/styles/theme.css` (`:root` and `html[data-theme="mirage"]`). Theme-only decoration lives in `web/src/styles/themes/<id>.css` and uses tokens only.
- Markup that differs per theme is rendered for **every** theme and shown by CSS (`.theme-terminal`, `.theme-mirage`, `-inline` variants). Components never branch on the theme during render.

## Reasons
- No flash of the wrong theme and no hydration mismatch: the server HTML is the same for every visitor.
- Pages stay static (no cookies, no dynamic rendering).
- A third theme is a new token block, a CSS file and (only if needed) extra `.theme-<id>` markup.

## Consequences
- Both heroes ship in the HTML (a small SVG and a few elements). The hidden matrix canvas stops animating because it isn't intersecting.
- Mirage fonts (Cormorant Garamond, Aref Ruqaa) are self-hosted with `preload: false`, so Terminal visitors never download them. The CSP is unchanged.
- The Open Graph image and favicons stay in the terminal look.
