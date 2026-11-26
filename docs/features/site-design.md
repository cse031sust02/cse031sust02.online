# Site Design: "cse031sust02"

The site presents as a small retro-futuristic developer OS / terminal, while staying readable for non-technical visitors (recruiters, founders).

> **Provisional.** The owner will judge the design on the real build and may change it. All tokens live in `web/src/styles/theme.css`, so the palette or the whole look can be swapped without touching components.

## Visual language
- Dark-first: near-black background, phosphor-green accent, cyan secondary, amber highlights.
- Monospace headings (JetBrains Mono), clean sans body.
- Window-chrome cards (traffic-light dots, title bar like `~/experience — zsh`).
- Optional CRT scanline/glow overlay; animated grid/matrix/particle background in the hero.
- **No photo or avatar.** The ASCII-art name is the identity.

## Themes
Two switchable themes ([ADR 007](../decisions/007-runtime-themes.md)). The choice is remembered in `localStorage` (`cse031sust02:theme`) and applied before first paint.

| Theme | Id | Look |
|---|---|---|
| Terminal (default) | `terminal` | Everything above: phosphor green, mono, window chrome, matrix rain, CRT. |
| Mirage | `mirage` | Islamic heritage × future tech: desert-night palette (sand, gold leaf, turquoise tile, terracotta dusk), drifting eight-point star lattice, a pointed-arch hero scene (dusk sky, crescent, dunes, skyline, rotating rosette, turquoise constellation network, data lines over the sand), the full name in Ruqaa calligraphy (`basics.name_arabic`: طلحة ابن إمام), a heat-haze "mirage" lake that reflects the skyline, drifting gold dust, Cormorant Garamond headings. Sections are illuminated panels (gold frame, inner hairline, corner rosettes, zellige title band) headed by a gold rosette medallion with the Arabic-Indic section number, a centred title and a star divider; content rises in on scroll (where `animation-timeline` is supported). Skills become arched tiles of pills, product cards have arched tops, the timeline uses star nodes, the footer opens with a zellige band. Matrix mode rains golden Arabic letters. No scanlines. |

Switch from the header segmented control (◐ Terminal | ✦ Mirage; until first use it pulses and shows a one-time "try Mirage" callout, remembered as `cse031sust02:theme-tried`), the footer, the command palette (`theme: switch`) or the terminal (`theme`, `theme mirage`).

How to add a theme: add its id to `web/src/lib/theme/themes.ts`, a token block in `theme.css`, decoration in `web/src/styles/themes/<id>.css`, and `.theme-<id>` markup only where the structure must differ.

## Pages
```
/          Home (sections below)
/twin      Full-screen Digital Twin chat
```

## Home sections (in order)
| # | Section | Terminal flavour | Content |
|---|---|---|---|
| 1 | Hero | `whoami` | ASCII name, title, tagline, CTAs: Chat with my AI Agent, Contact, GitHub, LinkedIn |
| 2 | About | `cat about.md` | Summary (optional stat counters when `stats` is set in the profile) |
| 3 | Experience | `git log --career` | Timeline styled as commits; expandable highlights + tech chips |
| 4 | Products | `ls ~/products` | GitHub-repo-style cards with links |
| 5 | Skills | `tree ~/skills` | Grouped skills tree |
| 6 | AI Agent teaser | `./agent --chat` | Mini chat with suggested prompts → `/twin` |
| 7 | Credentials | `cat credentials` | Education, certifications (verify links), awards |
| 8 | Terminal | `$` | Interactive CLI |
| 9 | Contact | `ping talha` | Contact form, GitHub, LinkedIn |
| 10 | Footer | | Shortcut hints, "built with", uptime gag |

## Nerdy interactions
- **Boot sequence** on first visit (~1.5 s, skippable, remembered in `localStorage`).
- **Typewriter** tagline under the ASCII name.
- **Command palette** (`⌘K` / `Ctrl+K`): jump to sections, run commands (`open github`, `twin`, `theme`, `matrix`).
- **Interactive terminal:** `help`, `whoami`, `ls products`, `cat experience`, `skills --tree`, `contact`, `clear`, `agent <question>` (alias `twin`), `theme [name]`, `sudo make-coffee`.
- **Easter eggs:** the Konami code toggles matrix mode; `rm -rf /` gives a joke reply.

## Navigation config
Nav items (label, anchor, terminal command) live in `web/src/config/nav.ts`. The header, section titles and (later) the command palette and sitemap read from it, so adding `/blog` or `/lab` is a config change.

## Implementation notes
- A tiny inline script in `<head>` applies `localStorage` state (`cse031sust02:booted`, `cse031sust02:crt`) to `<html data-booted data-crt>` before first paint, so returning visitors never see the boot screen flash. Without JS, the boot screen fades out on its own after ~2.5 s.
- The ASCII name is generated from `basics.name` (`web/src/lib/nerd/ascii-font.ts`) and drawn as SVG blocks.
- Terminal commands are a pure parser (`web/src/lib/terminal/commands.ts`) fed by a serializable slice of the profile.
- Matrix rain pauses when off-screen (IntersectionObserver) or when the tab is hidden, and never animates with reduced motion.
- Every keyboard feature has a clickable equivalent: header `⌘K` button, footer CRT/matrix toggles.
- No animation library is used (CSS + canvas only), which keeps the JS bundle small.

## Accessibility rules
- Every terminal feature has a normal clickable equivalent.
- WCAG AA contrast, visible focus, semantic landmarks.
- `prefers-reduced-motion` disables boot, rain, typewriter and scanlines.
- Works from 360px wide; terminal and chat work with mobile keyboards.
- Checked automatically: `web/e2e/a11y.spec.ts` (axe-core, WCAG 2.1 A/AA) and `web/e2e/layout.spec.ts` (no horizontal scroll at 360px).

## SEO & security
- Metadata (title template, description, canonical, Open Graph, Twitter) is built from `profile.yaml` + `NEXT_PUBLIC_SITE_URL` (inlined at build time; default `https://cse031sust02.online`).
- `/opengraph-image` (1200×630 PNG, terminal card), `icon.svg`, `apple-icon`, `/sitemap.xml` (routes from `web/src/lib/site.ts`), `/robots.txt` (disallows `/api/`).
- JSON-LD `Person` on `/`: name, job title, `sameAs` links, skills, education. Never email or phone.
- Custom 404: "404: command not found".
- Security headers for every route in `web/next.config.ts`: CSP (self only, plus Cloudflare Turnstile), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, COOP. The CSP allows inline scripts because the pages are static (nonces would force dynamic rendering). HSTS belongs on the TLS-terminating proxy.
- No CV download: the PDF contains private contact details.

## Specs
[003-site-sections](../../specs/completed/003-site-sections.md), [004-nerd-layer](../../specs/completed/004-nerd-layer.md), [007-seo-and-polish](../../specs/completed/007-seo-and-polish.md), [010-themes](../../specs/active/010-themes.md)
