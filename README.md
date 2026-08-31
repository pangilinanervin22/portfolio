# Ervin Pangilinan Portfolio

Personal portfolio built as a single-page static site with [Astro](https://astro.build). The design is a monochrome "drafting sheet": the page reads as a numbered drawing set (sheets 00–05) with dot-grid paper, film grain, ruler-tick margin rails, hairline rules instead of boxed cards, and black↔white inversion as the only hover color.

**Live site:** <https://pangilinanervin22.github.io/portfolio>

## Stack

- **Astro 7**: static output, all structure and styling in `.astro` components with scoped CSS
- **No client framework**: the theme toggle and custom cursor are Astro components with small vanilla scripts
- **TypeScript**: typed content data and components
- **Plain CSS**: design tokens as custom properties, light/dark themes, no CSS framework

## Commands

All commands are run from the root of the project:

| Command                | Action                                       |
| :--------------------- | :------------------------------------------- |
| `npm install`          | Install dependencies                         |
| `npm run dev`          | Start dev server at `localhost:4321`         |
| `npm run build`        | Build the production site to `./dist/`       |
| `npm run preview`      | Preview the production build locally         |
| `npm run check`        | Type-check with `astro check`                |
| `npm test`             | Playwright smoke tests against a prod build  |
| `npm run format`       | Format `src/` with Prettier                  |
| `npm run format:check` | Check formatting without writing             |

## Project structure

```text
/
├── .github/workflows/ci.yml       # astro check + build + Playwright smoke tests on every push/PR
├── .github/workflows/deploy.yml   # Build + deploy to GitHub Pages on push to main
├── public/
├── src/
│   ├── assets/                    # Portrait, project screenshots, tech + company logos
│   ├── components/
│   │   ├── _common/               # SectionHead (rule + sheet index + ghost numeral)
│   │   ├── CustomCursor.astro     # Drafting-instrument cursor (vanilla script)
│   │   ├── SwitchTheme.astro      # Theme toggle (vanilla script)
│   │   ├── experience/            # Work-history chronology
│   │   ├── introduction/          # About section with skill cards
│   │   ├── projects/              # Project cards ("plates" with fig. captions)
│   │   └── technology/            # Skill tiers grid
│   ├── data/                      # experiences.ts, projects.ts, technologies.ts
│   ├── layouts/Layout.astro       # Base head, fonts, scroll reveals, sheet rails
│   ├── pages/                     # index.astro, dynamic site.webmanifest.ts
│   ├── styles/                    # global.css, _theme.css (light), _theme_dark.css
│   └── consts.ts                  # Site title and description
├── tests/                         # Playwright smoke tests (see playwright.config.ts)
└── astro.config.mjs
```

The page composes five sections in order: **Welcome** (cover sheet), **Introduction**, **Experience**, **Technologies**, and **Projects**. Section content is plain typed arrays in `src/data/`; edit those files to add an entry.

## Design notes

- **Theming**: CSS custom properties defined per theme in `src/styles/_theme.css` and `_theme_dark.css`; the choice persists to `localStorage` and applies via a `data-theme` attribute on `<html>`.
- **Motion**: scroll reveals run through a single `IntersectionObserver` (elements opt in with `data-reveal`); hero animations are pure CSS keyframes. Everything respects `prefers-reduced-motion`, with a `<noscript>` fallback that force-reveals all content.
- **Imagery as plates**: the portrait renders grayscale until hover and carries a `fig. 01` caption; project screenshots are letterboxed in 16:9 plates (`object-fit: contain`), never cropped or stretched. All raster images go through `astro:assets` and ship as sized WebP.
- **SEO**: `BaseHead.astro` handles Open Graph/Twitter meta, canonical URLs, and JSON-LD (`Person`); a sitemap is generated at build time (submit `/portfolio/sitemap-index.xml` in Search Console; a project GitHub Pages site has no origin-level `robots.txt`), and `site.webmanifest` is generated from the base path.

## Configuration

Site URL and base path are read from environment variables in `astro.config.mjs` (create a `.env` file at the root to override locally):

| Variable                          | Default                                | Purpose                             |
| :-------------------------------- | :------------------------------------- | :---------------------------------- |
| `DEFAULT_PATH`                    | `https://pangilinanervin22.github.io/` | Canonical site URL                  |
| `DEFAULT_BASE`                    | `/portfolio`                           | Base path for all assets and routes |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | hardcoded fallback                     | Google Search Console verification  |

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site with the official Astro action (Node 22) and publishes it to GitHub Pages. The workflow can also be run manually from the Actions tab.
