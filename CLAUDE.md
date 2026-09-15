# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview the production build locally
npm run check     # astro check (types, props, unused imports)
npm test          # Playwright smoke tests against a production build (base path /portfolio)
```

The smoke tests in `tests/` build and preview the site themselves; locally they drive the installed Chrome (`channel: "chrome"`), in CI a downloaded Chromium. CI (`.github/workflows/ci.yml`) runs `astro check`, the build, and the tests on every push and pull request; `deploy.yml` publishes `main` to GitHub Pages.

## Environment Variables

The site URL and base path are driven by environment variables loaded via Vite in `astro.config.mjs`:

| Variable | Default | Purpose |
|---|---|---|
| `DEFAULT_PATH` | `https://pangilinanervin22.github.io/` | Canonical site URL |
| `DEFAULT_BASE` | `/portfolio` | Base path for all assets/routes |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | hardcoded fallback | Google Search Console verification |

Create a `.env` file at the root to override these for local development.

## Architecture

This is an **Astro 7** static site (portfolio) with no client-side framework: the two interactive pieces (theme toggle, custom cursor) are Astro components with small vanilla scripts.

### Page Structure

The single-page layout (`src/pages/index.astro`) composes sections in order:
1. `Welcome`: the cover sheet, with the name, its dimension line, the tagline, and the `TitleBlock`
2. `Introduction`: about me, with the portrait plate and skill cards
3. `Experience`: ledger of work history
4. `Techs` (Technology): stack tiers, where type size encodes how often a tool is used
5. `Projects`: project plates

Together with the footer these are the six numbered sheets of the drawing set: every section carries `data-sheet="01"` to `"06"` and a `data-sheet-title`, which the sheet tracker reads. `src/layouts/Layout.astro` wraps all pages, injects `BaseHead`, fonts, global CSS, `CustomCursor`, and `Footer`, and runs that tracker (see Animations).

### Component Conventions

- **Astro components** (`.astro`) handle all static structure and CSS. Scoped styles are co-located within each component file.
- **Client-side behaviour** lives in Astro `<script>` blocks (`SwitchTheme.astro`, `CustomCursor.astro`, `NavBar.astro` for the mobile menu, `Layout.astro` for the sheet tracker, `Welcome.astro` for the name-draw handoff, `_common/Dimension.astro` for measuring); there is no React or other client framework. Server-rendered markup must not depend on client-only state (theme, `localStorage`): the toggle renders both icons and lets CSS pick one, and the cursor starts `hidden` and enables itself only for fine pointers.
- Content for `Experience`, `Projects`, and the Stack tiers lives in typed arrays in `src/data/` — edit those files to add entries.
- **In-page links are plain `#hash` anchors**, never `${import.meta.env.BASE_URL}#hash`: the site is served at `/portfolio/`, so `/portfolio#hash` is a different path and forces a full reload (the dev server's `/` base hides this).
- **Raster images go through `astro:assets` `<Image>`** (webp, sized `widths`/`densities`), never a raw `<img src={img.src}>`, which ships the original file. Project screenshots are letterboxed with `object-fit: contain`; don't reintroduce `fill`.
- Muted text (`--color-text-muted`) is tuned to pass WCAG AA (4.5:1) on both the page background and the surface tone in both themes (the blueprint uses `#9bb1d2`); keep it there when adjusting the palette. `--color-text-faint` is decorative only and must never carry readable text.
- In multi-line prose with inline tags (e.g. `.tagline-mark` spans), Astro trims the whitespace on either side of a line break that touches a tag, gluing words together ("andNestJS"). Break lines only between two plain words; `tests/smoke.spec.ts` checks the hero for this.

### Theming

- CSS custom properties are defined in `src/styles/_theme.css` (light) and `src/styles/_theme_dark.css` (dark).
- Theme is persisted to `localStorage` and applied via the `data-theme` attribute on `<html>` (inline script in `Layout.astro` before paint, `SwitchTheme.astro` on toggle).
- All color usage should reference the CSS variables (e.g. `var(--color-primary)`, `var(--color-surface)`) rather than hardcoded values.
- Fonts go through Astro's Fonts API (`fonts[]` in `astro.config.mjs`, local woff2 files in `src/assets/fonts/`). It defines `--font-outfit` and `--font-jetbrains-mono` (family + metric-matched fallbacks); `_theme.css` maps them to `--font-display`, `--font-body` (both Outfit, a variable font) and `--font-mono`, which is what components use. Two families only: Outfit carries display and body, JetBrains Mono is the instrument face (title block, captions, dimensions, section rules). Add weights/files in the config, never via `@font-face` or fontsource imports.

### Animations

There is no scroll-reveal system; do not add one. The page has one orchestrated moment: on load the hero name draws itself (an outline via `-webkit-text-stroke` revealed by an animated `clip-path` inset, then filled) and the dimension line under it extends. `Welcome.astro` adds `.is-drawn` on `animationend` so the fill follows the theme tokens afterwards instead of a forwards-filled keyframe. Everything else is simply there. Hover transitions are colour and border only, never scale or slide.

The sheet tracker in `src/layouts/Layout.astro` is a single rAF-throttled scroll listener: it picks the `[data-sheet]` section whose top is above the 40% reading line (or the last sheet once the page is scrolled to the end) and updates both the nav `.is-active` link and the title block counter (`[data-tb-index]`, `[data-tb-name]`). All motion is wrapped in `prefers-reduced-motion` checks.

### Design system

Monochrome "drafting sheet" aesthetic, and the metaphor is structural, not decorative. The page is a numbered drawing set:

- **Title block** (`src/components/TitleBlock.astro`): the ruled box with name, role, sheet counter ("02 / 06" plus the sheet title) and revision date (last commit date via `src/lib/updated.ts`, shared with the footer). Fixed bottom-right on ≥1024px over a backdrop blur; static at the foot of the cover sheet below that. The footer keeps a 10.5rem bottom padding on desktop so the block ends up in clear paper.
- **Dimension lines** (`src/components/_common/Dimension.astro`): a hairline with end ticks and the real rendered length, measured at runtime from a target selector. There are exactly two on the page (hero name width, portrait height); keep it at two.
- **Section heads** (`src/components/_common/SectionHead.astro`): a rule with "Sheet NN" on the left and a meta note on the right, then the title. No ghost numeral, no boxed index.
- **Plates** (`src/components/projects/ProjectCard.astro`): the screenshot framed on a hatched ground (`--color-hatch`, a repeating 45° gradient that shows through the letterbox), a ruled "Plate NN" caption row, then the notes. No card box.
- **Chrome that is deliberately absent**: `//` prefixes, arrow glyphs on links and buttons, uppercase tracked labels, index numbers on anything that is not a sequence (the sheets and plates are the only sequences), middle-dot joined strings (lists are comma separated), drop caps.

Two themes, each a single hue: the **sheet** (light: off-white paper, ink black `#000`) and the **blueprint** (dark: white lines on Prussian blue `#0e2f63`). Inversion through the same tokens is the only hover "colour", black↔white on the sheet and white↔blue on the print. The cursor's difference blend would render peach on blue, so `src/styles/CustomCursor.css` switches it to plain white with a blue drop-shadow halo under `[data-theme="dark"]`.

Texture: a faint dot grid on `body::before`, an animated film grain on `body::after` (inline SVG noise data URI, ~9fps drift ≥768px, static under `prefers-reduced-motion`; intensity via `--grain-opacity` per theme), ruler-tick margin rails (`.sheet-rails` in Layout, ≥1360px), square corners (`--radius-sm`), hairline rules instead of boxes. The grain SVG filter must keep `color-interpolation-filters='sRGB'` or it renders several times weaker. `body` keeps `isolation: isolate` so the z:-1 dot-grid layer paints above the page background. Layout tokens (`--container`, `--gutter`, rail/hatch/grain colours) live in `src/styles/_theme.css` and `_theme_dark.css`.

### SEO / Meta

`src/components/BaseHead.astro` manages all meta tags including OG, Twitter cards, JSON-LD structured data (Schema.org `Person`), and canonical URLs. Site constants (title, description) live in `src/consts.ts`.

`src/pages/site.webmanifest.ts` generates the web app manifest from the configured base path. There is deliberately no `robots.txt` route: on a project GitHub Pages site it would be served under `/portfolio/`, where crawlers never look — submit `/portfolio/sitemap-index.xml` in Search Console instead.
