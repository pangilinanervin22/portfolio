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

GSAP + ScrollTrigger is used for scroll-driven blur/fade-in animations throughout section components. All animations are wrapped in `prefers-reduced-motion` checks and only run client-side.

### SEO / Meta

`src/components/BaseHead.astro` manages all meta tags including OG, Twitter cards, JSON-LD structured data (Schema.org `Person`), and canonical URLs. Site constants (title, description) live in `src/consts.ts`.

`src/pages/robots.txt.ts` dynamically generates `robots.txt` with the correct sitemap URL from `context.site`.
