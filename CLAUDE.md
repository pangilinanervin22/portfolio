# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview the production build locally
```

No test runner is configured in this project.

## Environment Variables

The site URL and base path are driven by environment variables loaded via Vite in `astro.config.mjs`:

| Variable | Default | Purpose |
|---|---|---|
| `DEFAULT_PATH` | `https://pangilinanervin22.github.io/` | Canonical site URL |
| `DEFAULT_BASE` | `/portfolio` | Base path for all assets/routes |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | hardcoded fallback | Google Search Console verification |

Create a `.env` file at the root to override these for local development.

## Architecture

This is an **Astro 6** static site (portfolio) with a React island integration for interactive components.

### Page Structure

The single-page layout (`src/pages/index.astro`) composes sections in order:
1. `Welcome` — hero/intro call-to-action
2. `Introduction` — about me with skill cards
3. `Experience` — timeline of work history
4. `Techs` (Technology) — technology icons grid
5. `Projects` — project cards grid

`src/layouts/Layout.astro` wraps all pages and injects `BaseHead`, fonts, global CSS, `CustomCursor` (React island), and `Footer`.

### Component Conventions

- **Astro components** (`.astro`) handle all static structure and CSS. Scoped styles are co-located within each component file.
- **React components** (`src/components/react/`) are used only where client-side interactivity is required (custom cursor, theme toggle). They use `client:load` directive.
- Data for `Experience` and `Projects` sections is hardcoded as typed arrays directly inside the component frontmatter with `// TODO: Move to CMS` comments — update the arrays in place when adding entries.

### Theming

- CSS custom properties are defined in `src/styles/_theme.css` (light) and `src/styles/_theme_dark.css` (dark).
- Theme is persisted to `localStorage` and applied via `data-theme` attribute on `<html>` by `SwitchTheme.tsx`.
- All color usage should reference the CSS variables (e.g. `var(--color-primary)`, `var(--color-surface)`) rather than hardcoded values.

### Animations

Scroll reveals use a single IntersectionObserver in `src/layouts/Layout.astro`: elements opt in with a `data-reveal` attribute (optionally staggered via an inline `--reveal-delay` custom property) and get `.is-revealed` added exactly once; the transition itself lives in `src/styles/global.css`. Hero load animations are pure CSS keyframes. All motion is wrapped in `prefers-reduced-motion` checks, with a `<noscript>` fallback that force-reveals everything.

### Design system

Monochrome "drafting sheet" aesthetic: a faint dot grid on `body::before`, an animated film grain on `body::after` (inline SVG noise data URI, ~9fps drift ≥768px, static under `prefers-reduced-motion`; intensity via `--grain-opacity` per theme), ruler-tick margin rails (`.sheet-rails` in Layout, ≥1360px), square corners (`--radius-sm`), hairline rules instead of boxed cards, and black↔white inversion as the only hover "color". The grain SVG filter must keep `color-interpolation-filters='sRGB'` or it renders several times weaker. `body` keeps `isolation: isolate` so the z:-1 dot-grid layer paints above the page background. Section headers are composed by `src/components/_common/SectionHead.astro` (rule + index + ghost numeral + title). Layout tokens (`--container`, `--gutter`, rail/ghost/grain colors) live in `src/styles/_theme.css` and `_theme_dark.css`.

### SEO / Meta

`src/components/BaseHead.astro` manages all meta tags including OG, Twitter cards, JSON-LD structured data (Schema.org `Person`), and canonical URLs. Site constants (title, description) live in `src/consts.ts`.

`src/pages/robots.txt.ts` dynamically generates `robots.txt` with the correct sitemap URL from `context.site`.
