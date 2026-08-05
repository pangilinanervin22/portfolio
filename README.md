# Ervin Pangilinan — Portfolio

Personal portfolio built as a single-page static site with [Astro](https://astro.build). The design is a monochrome "drafting sheet": the page reads as a numbered drawing set (sheets 00–05) with dot-grid paper, film grain, ruler-tick margin rails, hairline rules instead of boxed cards, and black↔white inversion as the only hover color.

**Live site:** <https://pangilinanervin22.github.io/portfolio>

## Stack

- **Astro 7** — static output, all structure and styling in `.astro` components with scoped CSS
- **React 19 islands** — only where client-side interactivity is needed (custom cursor, theme toggle), loaded with `client:load`
- **TypeScript** — typed content data and components
- **Plain CSS** — design tokens as custom properties, light/dark themes, no CSS framework

## Commands

All commands are run from the root of the project:

| Command                | Action                                       |
| :--------------------- | :------------------------------------------- |
| `npm install`          | Install dependencies                         |
| `npm run dev`          | Start dev server at `localhost:4321`         |
| `npm run build`        | Build the production site to `./dist/`       |
| `npm run preview`      | Preview the production build locally         |
| `npm run format`       | Format `src/` with Prettier                  |
| `npm run format:check` | Check formatting without writing             |

## Project structure

```text
/
├── .github/workflows/deploy.yml   # Build + deploy to GitHub Pages on push to main
├── public/
├── src/
│   ├── assets/                    # Portrait, project screenshots, tech + company logos
│   ├── components/
│   │   ├── _common/               # SectionHead (rule + sheet index + ghost numeral)
│   │   ├── react/                 # CustomCursor, SwitchTheme (React islands)
│   │   ├── experience/            # Work-history chronology
│   │   ├── introduction/          # About section with skill cards
│   │   ├── projects/              # Project cards ("plates" with fig. captions)
│   │   └── technology/            # Skill tiers grid
│   ├── data/                      # experiences.ts, projects.ts, technologies.ts
│   ├── layouts/Layout.astro       # Base head, fonts, scroll reveals, sheet rails
│   ├── pages/                     # index.astro, dynamic robots.txt.ts
│   ├── styles/                    # global.css, _theme.css (light), _theme_dark.css
│   └── consts.ts                  # Site title and description
└── astro.config.mjs
```

The page composes five sections in order: **Welcome** (cover sheet), **Introduction**, **Experience**, **Technologies**, and **Projects**. Section content is plain typed arrays in `src/data/` — edit those files to add an entry.

## Design notes

- **Theming** — CSS custom properties defined per theme in `src/styles/_theme.css` and `_theme_dark.css`; the choice persists to `localStorage` and applies via a `data-theme` attribute on `<html>`.
- **Motion** — scroll reveals run through a single `IntersectionObserver` (elements opt in with `data-reveal`); hero animations are pure CSS keyframes. Everything respects `prefers-reduced-motion`, with a `<noscript>` fallback that force-reveals all content.
- **Imagery as plates** — the portrait and project screenshots render grayscale until hover, letterboxed in 16:9 frames without cropping, each captioned `fig. 0N` with the image's real pixel dimensions.
- **SEO** — `BaseHead.astro` handles Open Graph/Twitter meta, canonical URLs, and JSON-LD (`Person`); a sitemap is generated at build time and `robots.txt` is generated dynamically from the site URL.

## Configuration

Site URL and base path are read from environment variables in `astro.config.mjs` (create a `.env` file at the root to override locally):

| Variable                          | Default                                | Purpose                             |
| :-------------------------------- | :------------------------------------- | :---------------------------------- |
| `DEFAULT_PATH`                    | `https://pangilinanervin22.github.io/` | Canonical site URL                  |
| `DEFAULT_BASE`                    | `/portfolio`                           | Base path for all assets and routes |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | hardcoded fallback                     | Google Search Console verification  |

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site with the official Astro action (Node 22) and publishes it to GitHub Pages. The workflow can also be run manually from the Actions tab.
