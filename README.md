# Ervin Pangilinan Portfolio

Personal portfolio built as a single-page static site with [Astro](https://astro.build). The design is a monochrome "drafting sheet": the page reads as a numbered drawing set (sheets 01 to 06) with a title block in the corner that counts sheets as you scroll, dimension lines that measure the page itself, dot-grid paper, film grain, ruler-tick margin rails, hairline rules instead of boxed cards, and inversion as the only hover colour. Dark mode is a blueprint: white lines on Prussian blue.

**Live site:** <https://pangilinanervin22.vercel.app>

## Stack

- **Astro 7**: static output, all structure and styling in `.astro` components with scoped CSS
- **No client framework**: the theme toggle and custom cursor are Astro components with small vanilla scripts
- **TypeScript**: typed content data and components
- **Plain CSS**: design tokens as custom properties, light/dark themes, no CSS framework
- **Self-hosted fonts** via Astro's Fonts API (local woff2 files, generated `@font-face`, metric-matched fallbacks, preloads)

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
├── .github/workflows/deploy.yml   # Publishes the page that forwards the old GitHub Pages address
├── .github/pages-redirect/        # That page: sends every old path on to the live site
├── public/                        # Favicon set, share card, résumé PDF
├── src/
│   ├── assets/                    # Portrait, project screenshots, tech + company logos
│   ├── components/
│   │   ├── _common/               # SectionHead (sheet rule + title), Dimension (measured line)
│   │   ├── CustomCursor.astro     # Drafting-instrument cursor (vanilla script)
│   │   ├── SwitchTheme.astro      # Theme toggle (vanilla script)
│   │   ├── TitleBlock.astro       # Sheet counter, revision date, name and role
│   │   ├── experience/            # Work-history ledger, employer first
│   │   ├── introduction/          # About section with the portrait plate and "What I build" rows
│   │   ├── projects/              # Project plates on hatched ground
│   │   └── technology/            # Stack tiers
│   ├── data/                      # experiences.ts, projects.ts, technologies.ts
│   ├── layouts/Layout.astro       # Base head, fonts, sheet tracker, sheet rails
│   ├── lib/updated.ts             # Last-commit date for the title block and footer
│   ├── pages/                     # index.astro, dynamic site.webmanifest.ts
│   ├── styles/                    # global.css, _theme.css (sheet), _theme_dark.css (blueprint)
│   └── consts.ts                  # Site title, role and description
├── tests/                         # Playwright smoke tests (see playwright.config.ts)
└── astro.config.mjs
```

The page is six sheets in order: **Welcome** (cover sheet), **Introduction**, **Experience**, **Technologies**, **Projects**, and the **Contact** footer. Section content is plain typed arrays in `src/data/`; edit those files to add an entry.

## Design notes

- **Theming**: CSS custom properties defined per theme in `src/styles/_theme.css` and `_theme_dark.css`; the choice persists to `localStorage` and applies via a `data-theme` attribute on `<html>`.
- **Title block**: the ruled box that carries the name, role, sheet counter and revision date. From 1440px wide it is fixed to the bottom-right corner, full while the cover is under it and reduced to the sheet counter in the right margin after that, so it never covers text; narrower screens keep it static in the cover's corner. A small scroll listener in `Layout.astro` keeps the counter, the compact state and the active nav link on the current sheet.
- **Contact sheet**: the page closes on the email address, set like the name and sized to fill one line of the column (container query units), with a copy button where the clipboard API exists.
- **Motion**: one moment only. On load the name draws itself in outline and fills, then the dimension line under it extends. There are no scroll reveals. Everything respects `prefers-reduced-motion`.
- **Imagery as plates**: the portrait renders grayscale until hover, carries a `fig. 01` caption and a vertical dimension of its rendered height; project screenshots sit on hatched ground in 16:9 plates (`object-fit: contain`), never cropped or stretched. All raster images go through `astro:assets` and ship as sized WebP.
- **SEO**: `BaseHead.astro` handles Open Graph/Twitter meta, canonical URLs, and JSON-LD: `WebSite`, which gives search results the site name (without it Google showed the host, "Vercel"), and `Person`. A sitemap is generated at build time (submit `https://pangilinanervin22.vercel.app/sitemap-index.xml` in Search Console), and `site.webmanifest` is generated from the base path.
- **Icons**: the favicon set in `public/` (SVG, `.ico` with 16/32/48 frames, PNGs at 96, 180, 192 and 512) is one drawing: the nav's EP stamp, filled, with the letters traced from Outfit 800.

## Configuration

Site URL and base path are read from environment variables in `astro.config.mjs` (create a `.env` file at the root to override locally):

| Variable                          | Default                                 | Purpose                             |
| :-------------------------------- | :-------------------------------------- | :---------------------------------- |
| `DEFAULT_PATH`                    | `https://pangilinanervin22.vercel.app/` | Canonical site URL                  |
| `DEFAULT_BASE`                    | `/`                                     | Base path for all assets and routes |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | hardcoded fallback                      | Google Search Console verification  |

The smoke tests and CI build under `/portfolio` on purpose: a base path exposes link and asset bugs that a root build hides, and a build that works under a base path also works at the root.

## Deployment

Vercel builds and deploys every push to `main`; the live site is <https://pangilinanervin22.vercel.app>.

The site used to live on GitHub Pages at `https://pangilinanervin22.github.io/portfolio`. That address now only forwards: `.github/workflows/deploy.yml` publishes `.github/pages-redirect/index.html` (also as `404.html`), which sends every old path, `#section` included, to the same place on Vercel. The workflow runs when that page or the workflow changes, or manually from the Actions tab.
