# Site Design: "TalhaOS"

The site presents as a small retro-futuristic developer OS / terminal, while staying readable for non-technical visitors (recruiters, founders).

> **Provisional.** The owner will judge the design on the real build and may change it. All tokens live in `web/src/styles/theme.css`, so the palette or the whole look can be swapped without touching components.

## Visual language
- Dark-first: near-black background, phosphor-green accent, cyan secondary, amber highlights.
- Monospace headings (JetBrains Mono), clean sans body.
- Window-chrome cards (traffic-light dots, title bar like `~/experience — zsh`).
- Optional CRT scanline/glow overlay; animated grid/matrix/particle background in the hero.
- **No photo or avatar.** The ASCII-art name is the identity.

## Pages
```
/          Home (sections below)
/twin      Full-screen Digital Twin chat
```

## Home sections (in order)
| # | Section | Terminal flavour | Content |
|---|---|---|---|
| 1 | Hero | `whoami` | ASCII name, title, tagline, CTAs: Chat with my twin, Contact, GitHub, LinkedIn |
| 2 | About | `cat about.md` | Summary, `status` line, stat counters |
| 3 | Experience | `git log --career` | Timeline styled as commits; expandable highlights + tech chips |
| 4 | Products | `ls ~/products` | GitHub-repo-style cards with links |
| 5 | Skills | `tree ~/skills` | Grouped skills tree |
| 6 | Twin teaser | `./twin --chat` | Mini chat with suggested prompts → `/twin` |
| 7 | Credentials | `cat credentials` | Education, certifications (verify links), awards |
| 8 | Terminal | `$` | Interactive CLI |
| 9 | Contact | `ping talha` | Contact form, GitHub, LinkedIn |
| 10 | Footer | | Shortcut hints, "built with", uptime gag |

## Nerdy interactions
- **Boot sequence** on first visit (~1.5 s, skippable, remembered in `localStorage`).
- **Typewriter** tagline under the ASCII name.
- **Command palette** (`⌘K` / `Ctrl+K`): jump to sections, run commands (`open github`, `twin`, `theme`, `matrix`).
- **Interactive terminal:** `help`, `whoami`, `ls products`, `cat experience`, `skills --tree`, `contact`, `clear`, `twin <question>`, `sudo make-coffee`.
- **Easter eggs:** the Konami code toggles matrix mode; `rm -rf /` gives a joke reply.

## Accessibility rules
- Every terminal feature has a normal clickable equivalent.
- WCAG AA contrast, visible focus, semantic landmarks.
- `prefers-reduced-motion` disables boot, rain, typewriter and scanlines.
- Works from 360px wide; terminal and chat work with mobile keyboards.

## Specs
[003-site-sections](../../specs/backlog/003-site-sections.md), [004-nerd-layer](../../specs/backlog/004-nerd-layer.md)
