# Monochrome Refined Portfolio Reskin

**Date:** 2026-04-06
**Approach:** Surgical reskin — restyle existing components without changing layout logic or markup structure.
**Goal:** Transform the portfolio from generic minimalism into a distinctive, monochrome refined aesthetic with warm surfaces, hairline borders, soft shadows, and monospace developer accents.

---

## 1. Color System

### Light Theme (`_theme.css`)

| Variable | Current | New | Purpose |
|---|---|---|---|
| `--color-bg` | `#ffffff` | `#faf8f6` | Warm off-white page background |
| `--color-surface` | `#fafafa` | `#ffffff` | Cards float white on warm bg |
| `--color-surface-alt` | `#f5f5f5` | `#f5f3f0` | Nested elements, code blocks |
| `--color-text-primary` | `#111111` | `#111111` | No change |
| `--color-text-secondary` | `#3d3d3d` | `#555555` | Slightly softer |
| `--color-text-muted` | `#666666` | `#999999` | For monospace labels, dates |
| `--color-accent` | `#4a6cf7` | `#111111` | Black is the accent |
| `--color-accent-hover` | `#3b5de6` | `#333333` | Softer black on hover |
| `--color-border` | `#e0e0e0` | `#eeeeee` | Hairline, barely visible |
| `--shadow-soft` | `0 2px 8px rgba(0,0,0,0.06)` | `0 1px 3px rgba(0,0,0,0.04)` | Subtler default |
| `--shadow-strong` | `0 4px 16px rgba(0,0,0,0.10)` | `0 4px 12px rgba(0,0,0,0.06)` | Subtler hover |

### Dark Theme (`_theme_dark.css`)

| Variable | Current | New | Purpose |
|---|---|---|---|
| `--color-bg` | `#0a0a0a` | `#111110` | Warm near-black |
| `--color-surface` | `#1d1d1d` | `#1c1c1a` | Warm dark cards |
| `--color-surface-alt` | `#2b2b2b` | `#2a2a26` | Warm dark nested |
| `--color-text-primary` | `#efefef` | `#eeeeee` | No meaningful change |
| `--color-text-secondary` | `#c8c8c8` | `#bbbbbb` | Slightly muted |
| `--color-text-muted` | (derived) | `#777777` | Monospace labels |
| `--color-accent` | `#6b8cff` | `#ffffff` | White is the accent |
| `--color-accent-hover` | `#8aa4ff` | `#dddddd` | Softer white on hover |
| `--color-border` | (derived) | `#2a2a28` | Warm dark hairline |
| `--shadow-soft` | (current) | `0 1px 3px rgba(0,0,0,0.15)` | Subtle on dark |
| `--shadow-strong` | (current) | `0 4px 12px rgba(0,0,0,0.25)` | Hover on dark |

---

## 2. Typography

### Font Addition

Add **JetBrains Mono** (weights 400, 500) via Google Fonts. Used as a monospace accent font throughout.

Add CSS variable:
```css
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Where Monospace Is Applied

- Experience section: dates, tech badges
- Technology section: all tech names and category labels
- Project cards: year badges, tech stack tags
- NavBar: nav link text
- Footer: tech stack info, build info
- Welcome section: subtitle/role text (optional, light touch)

### No Changes To

- Heading font (Outfit Variable) — keep as-is
- Body font (Sora) — keep as-is
- Font size scale (clamp system) — keep as-is
- Line heights and letter spacing — keep as-is

---

## 3. Borders & Depth

### Card Styling (Global)

All cards across sections follow the same pattern:

- `border: 1px solid var(--color-border)` — hairline, barely visible
- `border-radius: 12px` — consistent across all cards (normalize from current mix)
- `box-shadow: var(--shadow-soft)` — default state
- Hover: `transform: translateY(-2px)` + `box-shadow: var(--shadow-strong)`
- No border-color change on hover — border stays constant, only shadow changes
- Transition: `0.25s cubic-bezier(0.4, 0, 0.2, 1)` on transform and box-shadow

### What This Replaces

- Remove blue border-color on hover (Experience cards, Project cards)
- Remove accent-colored left borders or top borders
- Normalize border-radius (currently varies: 8px, 12px, 16px, 24px across components)

---

## 4. Experience Section

**File:** `src/components/Experience.astro`

### Layout Changes

- Remove alternating left/right desktop layout
- Switch to single-column, left-aligned timeline for all screen sizes
- Thin vertical line on left: `1px solid var(--color-border)`
- Small dot markers: `6px` diameter, filled `var(--color-text-primary)`, centered on line
- Cards positioned to the right of the timeline line

### Card Content

- Date: JetBrains Mono, `var(--color-text-muted)`, displayed above company name
- Company name: Outfit Variable, 600 weight
- Role: Sora, `var(--color-text-secondary)`
- Description: Sora 400, `var(--color-text-secondary)`
- Tech badges: JetBrains Mono, small (0.75rem), `background: var(--color-surface-alt)`, `border-radius: 4px`, no border

### Animation

- Keep GSAP ScrollTrigger blur-in on cards
- Remove stagger animation on individual tech badges within cards
- Cards still stagger entrance as a group

---

## 5. Technology Section

**File:** `src/components/Technology.astro`

### Layout Changes

- Replace badge grid with compact inline text list
- Group technologies by category with monospace uppercase labels
- Categories based on current data:
  - `FRONTEND` — Astro, React, React Native, TypeScript
  - `BACKEND` — Node.js, Express, NestJs, FastAPI, Python, Prisma
  - `DATABASE` — PostgreSQL, MongoDB
  - `TOOLS & INFRA` — Docker, Git, Azure, Jest, Unity (C#)
- Tech names displayed inline, separated by ` · ` (middle dot)
- All text in JetBrains Mono
- Category labels: weight 500, `var(--color-text-primary)`, uppercase, small (0.75rem)
- Tech names: weight 400, `var(--color-text-muted)`, regular size (0.9rem)

### What Gets Removed

- Badge grid layout (the individual icon+label boxes)
- GSAP batch entrance animation on individual badges
- Random pulse/scale animation (`throttledSpotlight` or similar)
- Technology icons (text-only in this design)

### Animation

- Keep section title blur-in on scroll
- Simple fade-in for the tech list as a whole (no per-item stagger)

---

## 6. Welcome Section

**File:** `src/components/Welcome.astro`

- **CTA button:** Change from border+blue-text to filled black (`var(--color-accent)`) with white text. On hover: `var(--color-accent-hover)`.
- **Social icons:** Remove circular background. Icons only, `var(--color-text-muted)` default, `var(--color-text-primary)` on hover. Transition opacity/color.
- **Role/subtitle text:** Consider using `var(--font-mono)` for the role description line (light developer signal).
- Keep fade-slide-up animation as-is.

---

## 7. Introduction Section

**File:** `src/components/Introduction.astro`

- **Portrait image:** Remove `grayscale(100%)` and `brightness(0.98)` filters — show natural color photo.
- **Portrait animation:** Remove `infiniteIntroImagePulse` keyframes — static image, no ambient animation.
- **Skill cards:** Apply global card styling (hairline border, 12px radius, soft shadow, consistent hover). Add monospace category label if not already present.
- Keep two-column grid layout as-is.
- Keep GSAP scroll animations as-is.

---

## 8. Projects Section

**File:** `src/components/Projects.astro`

- **Project images:** Remove `saturate(0.95)` desaturation — show full color screenshots.
- **Year badge:** Use JetBrains Mono font.
- **Tech stack tags:** Use JetBrains Mono, same styling as Experience tech badges.
- **Cards:** Apply global card styling (hairline border, 12px radius, consistent hover).
- **Link buttons:** Black fill + white text (matching Welcome CTA style).
- Keep card grid layout as-is.
- Keep GSAP scroll animations as-is.

---

## 9. NavBar

**File:** `src/components/NavBar.astro`

- **Nav links:** Use `var(--font-mono)` for link text — subtle developer signal.
- **Logo/site title:** Keep Outfit Variable.
- Keep responsive hamburger behavior as-is.
- Keep theme toggle as-is.

---

## 10. Footer

**File:** `src/components/Footer.astro`

- **Tech stack info:** Use `var(--font-mono)`.
- **Build info text:** Use `var(--font-mono)`.
- **Navigation links:** Keep Sora (body font) for readability.
- Keep multi-column layout as-is.
- Keep animated underline hover as-is.

---

## 11. Custom Cursor

**File:** `src/components/react/CustomCursor.tsx`

- Reduce glow intensity (lower opacity or blur radius).
- Light mode: change `mix-blend-mode` from `multiply` to something softer (e.g., `normal` with lower opacity, or `soft-light`).
- Dark mode: keep current behavior or match intensity reduction.
- Remove or reduce `glowPulse` animation intensity.

---

## 12. Animations Summary

| Animation | Current | New |
|---|---|---|
| GSAP ScrollTrigger blur-in | All sections | Keep — no change |
| Welcome fadeSlideUp | Staggered entrance | Keep — no change |
| Experience card stagger | Per-card + per-badge | Per-card only, remove badge stagger |
| Technology badge batch | GSAP batch entrance | Remove — simple fade-in for whole list |
| Technology random pulse | `throttledSpotlight` | Remove entirely |
| Introduction image pulse | `infiniteIntroImagePulse` | Remove entirely |
| Cursor glow pulse | `glowPulse` keyframes | Reduce intensity |
| Hover transitions | Various timings | Normalize to `0.25s cubic-bezier(0.4, 0, 0.2, 1)` |
| `prefers-reduced-motion` | Respected | Still respected — no change |

---

## 13. Files Modified

| File | Change Type |
|---|---|
| `src/styles/_theme.css` | Update CSS variables (colors, shadows) |
| `src/styles/_theme_dark.css` | Update CSS variables (colors, shadows) |
| `src/layouts/Layout.astro` | Add JetBrains Mono font import |
| `src/components/Experience.astro` | Restyle timeline, remove alternating layout |
| `src/components/Technology.astro` | Replace grid with inline list, remove animations |
| `src/components/Welcome.astro` | Restyle button, social icons |
| `src/components/Introduction.astro` | Remove image filters and pulse animation |
| `src/components/Projects.astro` | Remove desaturation, restyle badges/buttons |
| `src/components/NavBar.astro` | Monospace nav links |
| `src/components/Footer.astro` | Monospace tech info |
| `src/components/react/CustomCursor.tsx` | Reduce glow intensity |

---

## 14. Out of Scope

- No new sections or pages
- No changes to data structure (`src/data/`)
- No changes to SEO/meta (`BaseHead.astro`)
- No changes to `astro.config.mjs` or build pipeline
- No new dependencies (JetBrains Mono via Google Fonts CDN)
- No changes to responsive breakpoints
- No structural HTML changes (CSS-only reskin where possible)
