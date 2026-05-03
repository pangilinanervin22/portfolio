# Portfolio Recruiter-Pass Redesign

**Date:** 2026-05-03
**Approach:** Refine and elevate — preserve existing Astro 6 structure, theme system, GSAP animations, and component boundaries. Rework content, copy, layout posture, and identity treatment within current bones.
**Goal:** Convert recruiters and engineering managers within 30 seconds. Project a balanced full-stack profile (frontend craft AND backend rigor) through the site itself.

---

## 1. Audience and Direction

| | Decision |
|---|---|
| Primary audience | Recruiters and engineering managers (full-time hiring) |
| Role profile signaled | Balanced full-stack — credible at both UI and backend |
| Visual direction | Hybrid: distinctive personality + recruiter-friendly information density |
| Color | Strict monochrome (no accent hue introduced) |
| Tone | Confident, specific, current. Drop "soft" framing ("sometimes it works", "always learning"). |

---

## 2. Recurring Identity Layer

Three signature elements applied consistently across all sections. These are the things that make this portfolio feel like *one* designed object instead of generic minimalism.

### 2.1 Numbered section labels

Each major section gets a small mono label in the top-left, in the format `NN / Section`:

- `01 / About`
- `02 / Experience`
- `03 / Stack`
- `04 / Work`
- `05 / Contact` (footer)

Styling: `font-family: var(--font-mono)`, `font-size: 0.75rem`, `letter-spacing: 0.08em`, `color: var(--color-text-muted)`. Above the section heading. Becomes the visual rhythm of the page.

### 2.2 `//` mono prefix as accent device

Used sparingly (target: ~6–10 instances site-wide) to mark live signals, role labels, status, and meta callouts. Examples:

- `// OPEN TO OPPORTUNITIES` (hero status)
- `// NOW` (current-role badge in experience)
- `// FEATURED` (featured project label)
- `// MY ROLE` (project role line)
- `// IMPACT` (project impact line)
- `// CORE` / `// OFTEN` / `// SOMETIMES` / `// TOOLS` (stack tier labels)
- `// Currently learning` (about-section growth strip)
- `// Open to opportunities` (footer CTA)

Styling: same mono treatment as numbered labels but inline rather than block-positioned.

**Casing convention** (apply consistently):
- **UPPERCASE** for short status, badge, and inline-label uses: `// NOW`, `// FEATURED`, `// MY ROLE`, `// IMPACT`, `// CORE`, `// OFTEN`, `// SOMETIMES`, `// TOOLS`, `// OPEN TO OPPORTUNITIES` (hero status), `// AVAILABLE`
- **Sentence case** for heading-style block uses: `// Currently learning` (about strip heading), `// Open to opportunities` (footer block heading), `// Signals` (hero signal-strip label)

### 2.3 Status-line treatment

A thin one-line strip in JetBrains Mono showing live signals, used in two places: hero (above name) and footer (call-to-action top). Communicates "this is current and being shipped."

Hero status example: `// OPEN TO OPPORTUNITIES  ·  Manila → Remote`
Footer status example: `// Open to opportunities`

---

## 3. Typography Posture

Existing fonts stay (Outfit Variable for headings, Sora for body, JetBrains Mono for accent). What changes:

- **Bigger size jumps** — H1 hero name should feel dramatic next to body. Increase clamp upper bound from `4.5rem` to `clamp(3rem, 8vw, 6rem)`.
- **Tighter letter-spacing on display headlines** — `-0.04em` on hero name (currently `-0.03em`).
- **Mono used as identity, not just metadata** — bring it into more places (status lines, section labels, project meta) but stop using it for body or paragraph copy.
- **No new font additions.**

---

## 4. Layout Posture

- **Hero shifts from centered to left-aligned, asymmetric.** Content begins ~10–15% from left edge on desktop, full-width on mobile.
- **All other sections keep current alignment** — no need to alternate-flip everything; consistency matters more than novelty after the hero.
- **Generous vertical rhythm** preserved. Section spacing stays as-is.
- **Numbered labels anchor the top-left of every section** so the eye knows where to land.

---

## 5. Hero (`Welcome.astro`)

### 5.1 New layout

```
                                                       (NavBar above — sticky)

   // OPEN TO OPPORTUNITIES  ·  Manila → Remote          ← mono status, top
                                                          left-aligned at ~10% from edge

   Ervin Pangilinan                                      ← H1, very large, tight tracking
                                                          (clamp(3rem, 8vw, 6rem), -0.04em)

   Full-stack developer building reliable web 
   platforms — currently shipping Next.js & 
   Supabase at Cosmic Society.                           ← 3-line tagline, max ~60ch each
                                                          (Sora 400, ~1.2rem, line-height 1.5)

   ────────                                              ← thin rule (existing accent-line
                                                          treatment, animate width on load)

   [ Download CV → ]    Email   GitHub   LinkedIn        ← CV is primary monochrome button
                                                          rest are small mono text links

   // Signals
   ~5y coding   ·   2 production roles   ·   4 shipped projects   ·   Updated May 2026
                                                          ← mono signal strip, muted color


                                  ↓  01 / About          ← scroll hint with next-section label
```

### 5.2 Copy

- **Status line:** `// OPEN TO OPPORTUNITIES  ·  Manila → Remote`
- **H1:** `Ervin Pangilinan` (unchanged)
- **Tagline:** `Full-stack developer building reliable web platforms — currently shipping Next.js & Supabase at Cosmic Society.`
- **Primary CTA:** `Download CV →` (existing button, restyled — bigger, more confident)
- **Secondary links:** `Email · GitHub · LinkedIn` (text links with `→` on hover, mono)
- **Signal strip:** `~5y coding   ·   2 production roles   ·   4 shipped projects   ·   Updated MMM YYYY`
  - The "5y" comes from 2021 → current year. **Implementation: derive dynamically from current year so it stays accurate** — `${new Date().getFullYear() - 2021}y coding`.
  - "2 production roles" = HEQS + Cosmic Society (FiveTwenty was internship, judgment call — could be 3 if user prefers). Hardcoded for now.
  - "4 shipped projects" matches current project count. **Implementation: derive from `projects.length`** so it stays accurate when user adds projects.
  - "Updated MMM YYYY" = build date. **Implementation: same `toLocaleDateString` pattern as `Footer.astro`'s `buildDate`** — derive from `new Date()` at build time so it's never stale.
- **Scroll hint:** down arrow + mono `01 / About` label below it

### 5.3 Behavior

- Min-height changes from `80vh` to `90vh` so hero fills more of the viewport on most screens (currently feels too vertically constrained relative to content).
- Existing GSAP fade-slide-up animation cascade stays. Adjust delays so status, name, tagline, CTA, signals, scroll-hint all stagger in.
- Existing accent-line reveal animation stays.

---

## 6. NavBar (`NavBar.astro`)

Minimal changes. Three additions:

### 6.1 Active-section indicator

IntersectionObserver tracks which section is currently in viewport. Active nav item gets a thin `1px` underline below the text, styled `border-bottom: 1px solid var(--color-text-primary)`. Smooth transition (~150ms).

### 6.2 Resume button at right

Add a small `Resume ↓` button between the Contact nav item and the theme toggle. Same styling as primary monochrome button but smaller (`padding: 0.45rem 0.9rem`, `font-size: 0.78rem`, mono). Triggers same CV download as the hero CTA. Hidden on mobile (the hamburger menu surfaces all options including Resume).

### 6.3 Wordmark stays

`EP` wordmark in `Outfit Variable` 800. No change.

---

## 7. About (`Introduction.astro`)

### 7.1 Section label

`01 / About` mono label, top-left, replaces the current `About Me` H2 header position. The H2 itself becomes simply `About` (drop the "Me").

### 7.2 Layout

Keep 2-column grid on desktop. **Reverse current order so portrait sits on the *left* and content on the *right*** — reading flow aligns with how magazine pull-quotes work and feels more editorial.

### 7.3 Portrait treatment

Existing portrait card stays, but adds a small mono caption underneath:

```
            ┌─────────────┐
            │             │
            │   portrait  │
            │             │
            └─────────────┘
            // Manila, PH · 2026
```

Caption styling: mono, `0.72rem`, muted color, no border or background.

### 7.4 New prose (replaces current intro)

```
I started writing code in 2021. Today I ship full-stack web 
platforms for Cosmic Society, with prior production work at 
HEQS Group and FiveTwenty IT Services and a Computer Science 
degree from Cavite State University.

I work across the stack but lean toward backend depth — REST 
APIs, role-based access, audit logging, query optimization, 
CI/CD. I care about clean architecture, accessibility, and 
code the next person can read.
```

Drop-cap on first letter stays (existing first-letter style).

### 7.5 Skill cards

Heading changes from `What I can do` to `What I build`. Cards stay 4-up grid. Copy tightens:

| Card | New copy |
|---|---|
| Web platforms | Production apps in TypeScript, Next.js, NestJS. Server-rendered, SPA, or hybrid. |
| Mobile apps | Cross-platform with React Native + Expo. Offline-first, secure releases. |
| DevOps & deploys | CI/CD pipelines, Docker containers, cloud hosting on Vercel, AWS, DigitalOcean, Heroku. |
| Game dev | Small 2D Unity prototypes when I want to think about something different. |

Card titles also rename: "Web Applications" → "Web platforms", "Mobile Applications" → "Mobile apps", "DevOps Basics" → "DevOps & deploys", "Game Development" → "Game dev".

### 7.6 `// Currently learning` strip

New element below the skill cards:

```
// Currently learning
Rust   ·   Server Actions in Next 16   ·   LLM workflow design
```

Styling: mono label above, three muted mono items separated by `·`. No card or background — just a quiet strip.

---

## 8. Experience (`Experience.astro`)

### 8.1 Section label

`02 / Experience` mono label, top-left. The H2 `My Developer Timeline` becomes just `Experience`.

### 8.2 Timeline visual

- Keep vertical timeline structure
- **Replace dot markers with numbered markers** — small mono `01`, `02`, `03`, `04`, `05` (numbered most-recent-first as `01`). Hollow square frame for past, filled for current.
- Replace current dark "Now" pill badge with an outlined `// NOW` mono label. Smaller, lower visual weight.

### 8.3 Card structure

Each card moves from prose-style description to **summary line + outcome bullets** for current/recent roles, and a tighter form for older entries.

```
Mar 2026 → Present                             // NOW
Full-stack Developer
Cosmic Society · Berlin, Germany (Remote, via Penbrothers, Manila)

Building a multi-brand event-management platform 
for the European market.

  →  Shipping features and scaling the core product
  →  Modern stack: Next.js + Supabase, hosted on Netlify
  →  CI/CD via GitHub Actions; AI-assisted dev workflow with Claude

Next.js · Supabase · TypeScript · GitHub Actions · Netlify · Claude
```

Bullets use a `→` glyph (not standard disc bullets). Glyph styled in muted color, body text in secondary text color.

### 8.4 Weight gradient

Roles get progressively lighter visual treatment further back in time:

- **Cosmic Society** (current): full treatment, 3 outcome bullets
- **HEQS Group**: full treatment, 3 outcome bullets
- **FiveTwenty IT Services**: full treatment, 3 outcome bullets
- **Self-Employed (freelance)**: summary + 2 bullets
- **Cavite State University (student projects)**: summary + 1 bullet
- **2021 Self Learning**: one-liner only (no bullets)

This creates a "weight gradient" that mirrors recruiter reading priority.

### 8.5 New experience data (`src/data/experiences.ts`)

Replace existing `experiences` array with:

```typescript
export const experiences: ExperienceItem[] = [
  {
    role: "Full-stack Developer",
    company: "Cosmic Society",
    period: "Mar 2026 – Present",
    location: "Berlin, Germany · Remote (via Penbrothers, Manila)",
    summary: "Building a multi-brand event-management platform for the European market.",
    highlights: [
      "Shipping features and scaling the core product",
      "Modern stack: Next.js + Supabase, hosted on Netlify",
      "CI/CD via GitHub Actions; AI-assisted dev workflow with Claude",
    ],
    tech: ["Next.js", "Supabase", "TypeScript", "GitHub Actions", "Netlify", "Claude"],
  },
  {
    role: "Full-stack Developer",
    company: "HEQS Group",
    period: "Aug 2025 – Mar 2026",
    location: "Sydney, Australia · Remote",
    summary: "Built and maintained production web platforms in TypeScript & Next.js.",
    highlights: [
      "Migrated legacy code to App Router (Next.js 16); measurable performance and cost wins",
      "Managed CI/CD across Vercel, AWS, and Heroku",
      "Contributed to backend in NestJS",
    ],
    tech: ["TypeScript", "Next.js", "NestJS", "Vercel", "AWS", "Heroku", "GitHub Actions"],
  },
  {
    role: "Full-stack Developer",
    company: "Five Twenty IT Service",
    period: "Jun 2024 – Jun 2025",
    location: "Alabang, Muntinlupa City · Hybrid",
    summary: "End-to-end feature delivery on a corporate web platform.",
    highlights: [
      "Designed REST APIs and database schemas with Prisma + PostgreSQL",
      "Refined responsive React UI for daily-use workflows",
      "Strengthened reliability with Jest test coverage and Docker-based dev",
    ],
    tech: ["Express", "React", "TypeScript", "Prisma", "PostgreSQL", "DigitalOcean", "Jest", "Docker"],
  },
  {
    role: "Freelance Developer",
    company: "Self-Employed",
    period: "2023 – 2025",
    location: "Remote",
    summary: "Landing pages, small-business sites, and one mobile app for paying clients.",
    highlights: [
      "Semantic, accessible markup with lightweight tooling",
      "Recycling app with Supabase backend and offline-first sync",
    ],
    tech: ["Next.js", "React Native", "Supabase"],
  },
  {
    role: "Student Projects",
    company: "Cavite State University Bacoor",
    period: "2022 – 2024",
    location: "Bacoor, Cavite",
    summary: "Thesis and team projects with full-stack architecture, state management, and automated tests.",
    highlights: [
      "Co-built a gender-fair NLP revision tool with FastAPI + spaCy (group thesis)",
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "C#", "Unity", "Python", "FastAPI", "spaCy"],
  },
  {
    role: "Getting Started",
    company: "Self-taught",
    period: "2021",
    location: "Online",
    summary: "HTML, CSS, JS, Java, Git. Where it began.",
    highlights: [],
    tech: ["HTML", "CSS", "JavaScript", "Java", "Git"],
  },
];
```

ExperienceItem interface adds `summary: string` and `highlights: string[]` fields. Old `description` field is dropped.

---

## 9. Stack (`Technology.astro`)

### 9.1 Section label

`03 / Stack` mono label, top-left. Section H2 changes from `My Skills` to `Stack`.

### 9.2 Replace 6-card grid with tiered view

Current 6 identical category cards become 4 tiers organized by use frequency:

```
03 / Stack
What I reach for, in rough order of frequency.

// CORE — daily
TypeScript   Next.js   React   Node.js   Express   PostgreSQL   Prisma   Docker

// OFTEN — regular reach
NestJS   React Native   Expo   Tailwind   GitHub Actions   Vercel   AWS   Supabase

// SOMETIMES — shipped at least once
Laravel   FastAPI   Python   MongoDB   MySQL   Firebase   C#   Unity

// TOOLS — daily workflow
Git   Figma   Postman   Draw.io   n8n   Ollama   OpenAI API   Claude
```

Visual treatment:

- Each tier on its own row
- Mono `// LABEL — context` heading per tier (left-aligned, full-width row)
- Pills below in `flex-wrap` row, generous gap (`0.6rem`)
- Pill weight differs by tier:
  - CORE: `--color-text-primary`, regular weight, slightly larger
  - OFTEN: `--color-text-secondary`, regular weight
  - SOMETIMES: `--color-text-muted`, regular weight
  - TOOLS: `--color-text-muted`, regular weight, smallest
- No card backgrounds. Just spacing and weight to create the visual.
- Width matches existing section width (`min(880px, 90%)`).

### 9.3 New stack data (`src/data/technologies.ts`)

Replace `skillGroups` array with a `skillTiers` array:

```typescript
export interface SkillTier {
  label: string;        // CORE, OFTEN, SOMETIMES, TOOLS
  context: string;      // "daily", "regular reach", etc.
  skills: string[];
}

export const skillTiers: SkillTier[] = [
  {
    label: "CORE",
    context: "daily",
    skills: ["TypeScript", "Next.js", "React", "Node.js", "Express", "PostgreSQL", "Prisma", "Docker"],
  },
  {
    label: "OFTEN",
    context: "regular reach",
    skills: ["NestJS", "React Native", "Expo", "Tailwind", "GitHub Actions", "Vercel", "AWS", "Supabase"],
  },
  {
    label: "SOMETIMES",
    context: "shipped at least once",
    skills: ["Laravel", "FastAPI", "Python", "MongoDB", "MySQL", "Firebase", "C#", "Unity"],
  },
  {
    label: "TOOLS",
    context: "daily workflow",
    skills: ["Git", "Figma", "Postman", "Draw.io", "n8n", "Ollama", "OpenAI API", "Claude"],
  },
];

// Flat list retained for SEO structured data
export const allSkills = skillTiers.flatMap((t) => t.skills.map((label) => ({ label })));
```

The old `skillGroups` export is removed. Anything that imported it (BaseHead schema, etc.) updates to `allSkills` (already exists for backward compat).

---

## 10. Projects (`Projects.astro` + `ProjectCard.astro`)

### 10.1 Section label

`04 / Work` mono label. H1 (currently) changes to H2 `Work` (also fixes the H1-after-H1 hierarchy issue — there's already an H1 in the hero).

### 10.2 Intro line

Replace `"Selected personal, academic & internship work. Each emphasizes learning, maintainability & real user value."` with:

`"Selected work from internship, freelance, and academic projects. Each shipped to real users."`

### 10.3 Featured project layout

The first project in the array (Paysera Timekeeping System) gets a featured-card treatment:

- Wider card spanning the full grid width (instead of one of two columns)
- Internal layout: image on the left (~50%), content on the right (~50%)
- `// FEATURED` mono label inside the card header
- Same content structure as regular cards otherwise

The remaining 3 projects render in the existing 2-column grid below.

Implementation: in `Projects.astro`, separate `projects[0]` from `projects.slice(1)`, render the first via `<ProjectCard featured />`, render the rest via the existing `<ProjectCard />`. The `featured` prop drives a layout variant in `ProjectCard.astro`.

### 10.4 Card content additions

Both featured and regular cards add two new mono lines above the description:

```
// MY ROLE   Backend lead — RBAC, audit logging, API design
// IMPACT    Used daily by FiveTwenty's clients in production
```

Each line is mono `0.78rem`, label in `--color-text-muted`, value in `--color-text-secondary`. Two lines max, one of each.

`// IMPACT` is optional per project. Only included when honestly fillable. Card layout collapses gracefully when one or both are absent.

### 10.5 Project data updates (`src/data/projects.ts`)

Add `role` and `impact` optional string fields to `ProjectItem`. Updated entries:

```typescript
{
  title: "Paysera Timekeeping System",
  role: "Backend lead — RBAC, audit logging, API design, performance tuning, automated tests",
  impact: "Used daily by FiveTwenty's enterprise clients in production",
  description: "Internship at FiveTwenty: our team built a timekeeping platform...",
  // ... rest unchanged
},
{
  title: "Fair Write (Gender Fair Revision)",
  role: "Backend + NLP — REST APIs, real-time bias detection pipelines",
  impact: "Group thesis project; live demo serving real users",
  // ...
},
{
  title: "Ajapco Sales & Inventory System",
  role: "Solo developer — full stack",
  // impact omitted
  // ...
},
{
  title: "GreenCycle Mobile App",
  role: "Solo developer — backend, offline sync, cross-platform testing",
  impact: "Tested data sync between cloud and local storage on Android and iOS",
  // ...
},
```

### 10.6 Hover state polish

- Existing transform/scale stays
- Add `→` glyph that slides in on hover next to "Live" / "GitHub" links (currently they have an icon — add a small `→` after the text label)
- Border on hover gets slightly darker (use `--color-text-primary` at lower opacity)

---

## 11. Footer (`Footer.astro`)

### 11.1 New top CTA block

Above the existing 4-column grid, add a centered call-to-action block:

```
                // Open to opportunities

         Looking for a full-stack developer
         comfortable across the stack and shipping?
         Let's talk.

  [ pangilinanervin22@gmail.com → ]   [ LinkedIn → ]   [ Resume ↓ ]
```

Styling:

- Mono `// Open to opportunities` label, centered, `--color-text-muted`, top
- Headline below in display weight (Outfit Variable 600, ~`clamp(1.5rem, 3vw, 2.2rem)`)
- Three actions in a centered row: email button (primary monochrome), LinkedIn (secondary outline), Resume download (secondary outline)
- Block padding: `3rem 1rem 2rem`
- Border-bottom hairline separating from grid below

### 11.2 Existing 4-column grid — copy tightening

| Element | Current | New |
|---|---|---|
| Tagline | "Always learning, always growing." | "Manila, Philippines · Building for the world." |
| Heading capitalization | "Navigate" / "Connect" | `// NAVIGATE` / `// CONNECT` (mono, lowercase prefix style consistent with rest) |
| Stack line | "Stack: Astro · TypeScript · css" | "Stack: Astro · TypeScript · CSS" (capitalization fix) |
| Build line | "Built with Astro. Updated [date]." | unchanged |
| Back to top | "Back to top ↑" | unchanged |

### 11.3 Layout

Existing 4-column responsive grid stays exactly as-is below the new CTA block. Mobile collapses naturally.

---

## 11.5 Site meta description (`src/consts.ts`)

Current `SITE_DESCRIPTION` contains the same "Sometimes it works, sometimes I learn" phrasing we're removing from the on-page copy. Update for consistency:

```typescript
export const SITE_DESCRIPTION = "Ervin Pangilinan — full-stack developer building reliable web platforms with TypeScript, Next.js, and Node. Currently shipping at Cosmic Society. Open to opportunities.";
```

`SITE_TITLE` (`"Ervin Pangilinan"`) stays unchanged.

---

## 12. Animation and Motion

No new animations introduced. Existing GSAP scroll-blur cascade stays. Adjustments:

- Hero gets one additional staggered element (signal strip)
- Section labels (`01 / About`, etc.) animate in alongside section heading
- `// Now`, `// Featured`, `// My role`, `// Impact` labels do not animate independently — they animate as part of their parent card's reveal
- All `prefers-reduced-motion` checks stay

---

## 13. What Stays Exactly the Same

- Astro 6 framework, all routing, build/deploy config
- Theme system: light + dark CSS custom properties, `data-theme` attribute toggle, `SwitchTheme.tsx`
- All accessibility scaffolding: skip link, ARIA labels, schema.org markup, focus indicators, `prefers-reduced-motion`
- Custom cursor (`CustomCursor.tsx`) — no change
- BaseHead and SEO meta — no change beyond the schema.org `Person` `knowsAbout` array potentially shrinking if we drop categories not represented in the new tier list
- Background image overlay
- Component file structure (`introduction/`, `experience/`, `projects/`, `technology/`, etc.)
- Color tokens (`_theme.css`, `_theme_dark.css`) — no values change
- Font setup (Outfit Variable, Sora, JetBrains Mono)
- Border component (`_common/Border.astro`)
- Mobile breakpoints

---

## 14. Out of Scope

- Adding a blog, writing section, or any new page
- Multi-page architecture changes
- New integrations (no analytics, no contact form, no CMS)
- Tests (no test runner exists in the project; not adding one in this pass)
- Color palette changes (strict monochrome stays)
- Font changes
- Replacing GSAP or the React island setup
- Non-recruiter audiences (peer-impressing technical depth pages, etc.)

---

## 15. Acceptance Criteria

A successful pass meets all of the following:

1. Hero loads with status line, name, specific tagline mentioning Cosmic Society, primary CV button, secondary links, and signal strip
2. About section shows numbered label, reversed-order portrait + content layout, rewritten prose, sharper skill cards, and `// Currently learning` strip
3. Experience timeline shows numbered markers, current Cosmic Society role with `// NOW` mono label, weight-graded entries, summary + outcome-bullet structure
4. Stack section replaces 6 cards with 4 tiered rows (`// CORE / OFTEN / SOMETIMES / TOOLS`) using weight to differentiate frequency
5. Projects section leads with featured Paysera card (image left, content right) and 3 secondary cards in 2-col grid below; all cards include `// MY ROLE` and (where applicable) `// IMPACT` lines
6. Nav adds active-section indicator and `Resume ↓` button (desktop only)
7. Footer adds top CTA block with three actions and tightens copy below
8. All existing accessibility, SEO, theming, and reduced-motion behavior preserved
9. Site builds clean with `npm run build` and previews correctly
10. Lighthouse scores not regressed on Performance, Accessibility, Best Practices, SEO

---

## 16. Open Questions / Notes for Implementation

- **HEQS end date**: confirmed Mar 2026 (overlaps with Cosmic Society start of Mar 17 — ok, contiguous)
- **Cosmic Society location**: assumed Berlin, Germany. Adjust if different German city.
- **"European market"** scope claim: assumed; user should confirm or change to "DACH" or other phrasing
- **"~5y coding"** in hero signal strip: counts 2021 → 2026; user can change to "5y" or "5+ years"
- **"2 production roles"**: counts HEQS + Cosmic Society; user may prefer "3" if FiveTwenty internship counts
- **`Claude` in tech chips**: positioned at end of Cosmic Society tech chip row and described in bullets as "AI-assisted dev workflow" so it isn't misread as a product dependency. Also added to `// TOOLS` tier in stack section.
- **`// Currently learning` strip content** (Rust · Server Actions in Next 16 · LLM workflow design): placeholder; user should confirm or supply their actual current learning topics
- **BaseHead schema.org**: `knowsAbout` array currently lists `["Web Development", "Mobile Development", "DevOps", "Full Stack Development"]` — no change needed, still accurate
