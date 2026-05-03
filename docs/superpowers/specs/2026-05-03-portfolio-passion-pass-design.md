# Portfolio Passion-Pass Reframe

**Date:** 2026-05-03
**Approach:** Targeted content + small structural changes on top of the recruiter-pass redesign (`feat/recruiter-pass-redesign`). No re-layout, no re-theming.
**Goal:** Reframe the portfolio from "recruiter conversion" to "personal craft showcase." The site should read as the work of a developer who loves building things, not someone shopping for a job. Stating current employment stays (it's a fact, not a pitch); explicit availability signals come out.

This spec is the second pass on this branch. It builds on `2026-05-03-portfolio-recruiter-pass-design.md` (already implemented) and *replaces* the job-seeking framing introduced there with a B2 "curious builder" voice.

---

## 1. Direction

| | Decision |
|---|---|
| Primary message | Skills + passion for building things |
| Voice | Curious builder — warmer, first-person, factual; no marketing language |
| Job-hunt signals | All explicit ones removed (status, CTA pitch, CV buttons, CV-stat strip) |
| CV/Resume PDF | File stays in `public/`; URL still resolves; UI no longer surfaces it |
| Layout / structure / theme / GSAP | All preserved from the recruiter-pass implementation |
| Section labels (`01 / About` etc.) | Preserved |
| `//` mono accent system | Preserved (still used for `// CURRENTLY`, `// Currently exploring`, `// FEATURED`, `// NOW`, `// CORE/OFTEN/SOMETIMES/TOOLS`, `// Say hi`, `// NAVIGATE`, `// CONNECT`) |

---

## 2. Hero (`src/components/Welcome.astro`)

### 2.1 Status line

**Current:**
```
// OPEN TO OPPORTUNITIES  ·  Manila → Remote
```

**New:**
```
// CURRENTLY  ·  Cosmic Society  ·  Manila
```

Implementation: edit the existing `.status` `<p>` element. The new inner structure (left-to-right) is:

```astro
<p class="status" aria-label="Current state">
        <span class="status-mark" aria-hidden="true">//</span>
        <span class="status-text">CURRENTLY</span>
        <span class="status-sep" aria-hidden="true">·</span>
        <span class="status-loc">Cosmic Society</span>
        <span class="status-sep" aria-hidden="true">·</span>
        <span class="status-loc">Manila</span>
</p>
```

(The previous markup had only one `.status-loc` span containing `Manila → Remote`. We now have two `.status-loc` spans separated by an additional `·` `.status-sep`. The `aria-label` on the wrapper changes from `"Availability status"` to `"Current state"`.)

No CSS changes needed: `.status-loc`, `.status-sep`, `.status-text`, `.status-mark` rules already work for multiple instances.

### 2.2 Tagline

**Current:**
> "Full-stack developer building reliable web platforms — currently shipping `Next.js & Supabase` at `Cosmic Society`."

**New:**
> "I've been writing software since 2021. Today I build event-management things at `Cosmic Society` and chase whatever rabbit hole catches my attention — currently `TypeScript`, `Next.js`, `Supabase`, and learning `Rust` on the side."

The `<span class="tagline-mark">` highlight treatment applies to: `Cosmic Society`, `TypeScript`, `Next.js`, `Supabase`, `Rust`. Plain text otherwise.

### 2.3 Primary action row

**Current:**
- Primary `Download CV →` button (filled monochrome)
- Three small text links: Email · GitHub · LinkedIn

**New:**
- Just the three text links: Email · GitHub · LinkedIn (same mono treatment as today)
- The `Download CV` `<a class="btn-primary">` is removed entirely
- The `.btn-primary`, `.btn-arrow`, and any related CSS rules in `Welcome.astro` are removed (they're no longer used). Keep the `.btn-primary:hover .btn-arrow` rules out too.
- The `<div class="actions">` wrapper stays. It now contains only `<nav class="text-links">`.

### 2.4 Replace `// Signals` strip with `// Currently exploring`

**Current** (at the bottom of the hero content):
```
// Signals
~5y coding · 2 production roles · 4 shipped projects · Updated MMM YYYY
```

**New:**
```
// Currently exploring
Rust ownership model  ·  Server-side AI workflows  ·  Cleaner test architecture
```

Implementation: rename the `.signals` block to `.exploring` (or keep the class name as-is and just change content; lower-effort path is to keep `.signals` and `.signals-label` / `.signals-list` selectors and just replace the inner text and remove the dynamic-value imports). The dynamic computations (`yearsCoding`, `projectCount`, `updatedLabel`) and the `import { projects }` are removed because nothing in the hero references them anymore.

The three values (`Rust ownership model`, `Server-side AI workflows`, `Cleaner test architecture`) are placeholders — flagged in section 12 as user-supplied content. The user should replace them with what they're actually exploring this month.

### 2.5 Scroll hint stays exactly as-is

`↓ 01 / About` linked to `#introduction`.

### 2.6 Frontmatter cleanup

Remove the now-unused frontmatter computations in `Welcome.astro`:

```typescript
// REMOVE these — no longer referenced:
import { projects } from "../data/projects";

const yearsCoding = new Date().getFullYear() - 2021;
const projectCount = projects.length;
const updatedLabel = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
});
```

---

## 3. NavBar (`src/components/NavBar.astro`)

### 3.1 Drop the Resume button

Remove the entire `<li class="nav-resume">...</li>` block from the nav list. The CSS rules `.nav-resume`, `.nav-resume .resume-btn`, `.nav-resume .resume-btn:hover`, and the `@media (max-width: 768px) .nav-resume .resume-btn` block are removed too — no longer referenced.

The `prefers-reduced-motion` rule that mentions `.nav-resume .resume-btn` should drop that selector (keep the `.nav-list li a[data-section]::after` selector that's also in that rule).

### 3.2 Everything else stays

- Active-section indicator (IntersectionObserver script) — unchanged
- `EP` wordmark — unchanged
- All section nav links — unchanged
- Theme toggle — unchanged
- Mobile hamburger — unchanged

---

## 4. About (`src/components/introduction/Introduction.astro`)

### 4.1 Prose rewrite

**Current first paragraph:**
> "I started writing code in 2021. Today I ship full-stack web platforms for Cosmic Society, with prior production work at HEQS Group and FiveTwenty IT Services and a Computer Science degree from Cavite State University."

**Current second paragraph:**
> "I work across the stack but lean toward backend depth — REST APIs, role-based access, audit logging, query optimization, CI/CD. I care about clean architecture, accessibility, and code the next person can read."

**New first paragraph:**
> "I write software, mostly for the web. Started in 2021 and haven't stopped. Today I'm at Cosmic Society building an event-management platform — before that, HEQS Group and FiveTwenty IT Services. Computer Science grad from Cavite State University."

**New second paragraph:**
> "I work across the stack but lean toward backend depth — REST APIs, role-based access, audit logging, query optimization, CI/CD. I care about clean architecture, accessibility, and code the next person can read. The rest of my time goes to whatever I'm currently learning."

(First paragraph is fully reworded for warmer voice. Second paragraph keeps the technical content list and adds one closing sentence about ongoing learning.)

### 4.2 Drop the `// Currently learning` strip

The hero now owns the "currently exploring/learning" beat. Remove the `<div class="learning-strip">` block from `Introduction.astro` markup, and remove the associated CSS (`.learning-strip`, `.learning-label`, `.learning-list`, `.learning-list li`).

The GSAP `targets = container.querySelectorAll(...)` selector list in the script block currently includes `.learning-strip` — remove that token from the selector string.

### 4.3 Skill cards stay exactly as-is

Web platforms / Mobile apps / DevOps & deploys / Game dev — copy already fits the B2 voice. No changes.

---

## 5. Stack section (`src/components/technology/Technology.astro`)

### 5.1 Subhead copy

**Current:**
```
What I reach for, in rough order of frequency.
```

**New:**
```
Tools I work with — sorted by how often I actually reach for them.
```

(Same `.tech-intro` element; just the inner text changes.)

### 5.2 Everything else stays

- Section label `03 / Stack` — unchanged
- H2 "Stack" — unchanged
- 4 tier rows (`// CORE / // OFTEN / // SOMETIMES / // TOOLS`) — unchanged
- Tier context strings (daily / regular reach / shipped at least once / daily workflow) — unchanged
- Pills, weight gradient, hover behavior — unchanged
- Schema.org markup — unchanged

---

## 6. Projects (`src/data/projects.ts` + `src/components/projects/ProjectCard.astro` + `src/components/projects/Projects.astro`)

### 6.1 `ProjectItem` interface changes

Remove `role?: string` and `impact?: string` from `ProjectItem`. The interface becomes:

```typescript
export interface ProjectItem {
        title: string;
        description: string;
        stack: string[];
        repo?: string;
        demo?: string;
        year?: string;
        image?: ImageMetadata;
        imageAlt?: string;
}
```

### 6.2 Project descriptions rewritten

The existing `role` and `impact` content folds into the `description` field as conversational first-person prose. The four entries in `src/data/projects.ts` change as follows:

**Paysera Timekeeping System:**
- DROP: `role`, `impact`
- NEW `description`: `"Internship at FiveTwenty: a small team built a timekeeping platform. I owned the backend — role-based access, audit logging, API design, performance tuning, automated tests. It's in daily production use by FiveTwenty's enterprise clients."`

**Fair Write (Gender Fair Revision):**
- DROP: `role`, `impact`
- NEW `description`: `"Group thesis project — a writing tool that flags biased terms and suggests inclusive alternatives in real time. I worked on the backend and NLP side: REST APIs, the bias-detection pipeline, and the LanguageTool + spaCy integration. Live demo's still online."`

**Ajapco Sales & Inventory System:**
- DROP: `role`
- NEW `description`: `"Freelance project — a sales and inventory system for a Japanese sweets shop. Built solo, full stack."`

**GreenCycle Mobile App:**
- DROP: `role`, `impact`
- NEW `description`: `"Freelance project — a recycling app I built solo. Online-first backend with offline support and tested cloud↔local sync across Android and iOS."`

All other fields (`title`, `stack`, `year`, `repo`, `demo`, `image`, `imageAlt`) stay unchanged.

### 6.3 `ProjectCard.astro` changes

Remove the `<dl class="meta-lines">` block (with its `// MY ROLE` and `// IMPACT` rendering) entirely. Remove the associated CSS rules:
- `.meta-lines`
- `.meta-row`
- `.meta-row dt`
- `.meta-row dd`
- The `@media (max-width: 520px) .meta-row { ... }` rule

Component still renders: image, header (with `// FEATURED` label when featured + title + year), description paragraph, stack chips, links. Same structure minus the meta-lines block.

### 6.4 `Projects.astro` subhead

**Current:**
> "Selected work from internship, freelance, and academic projects. Each shipped to real users."

**New:**
> "Things I've built — internship, freelance, and a couple of academic projects."

(Same `.section-intro` element; just the inner text changes.)

### 6.5 H2 stays

`<h2>Work</h2>` — section heading unchanged.

---

## 7. Footer (`src/components/Footer.astro`)

### 7.1 CTA block — copy rewrite + Resume button removal

**Current CTA block:**
- Label: `// Open to opportunities`
- Headline: "Looking for a full-stack developer comfortable across the stack and shipping?"
- Sub: "Let's talk."
- Three buttons: Email (primary), LinkedIn (outline), Resume (outline)

**New CTA block:**
- Label: `// Say hi`
- Headline: "Want to talk about code, projects, or anything in between?"
- Sub: REMOVED (the new headline absorbs the closer, no need for a separate "Let's talk." line)
- Two buttons: Email (primary), LinkedIn (outline). Resume button removed entirely.

Markup-level changes inside the existing `<section class="cta-block">`:
- `<p class="cta-label">` inner text: `// Open to opportunities` → `// Say hi`
- `<h3 class="cta-headline">` inner text: full rewrite
- `<p class="cta-sub">Let's talk.</p>` — DELETE this line entirely
- `<div class="cta-actions">` — remove the third anchor (the Resume one with `download="..."`)

### 7.2 Existing 4-column grid stays unchanged

Brand + tagline (`Manila, Philippines · Building for the world.`), `// NAVIGATE`, `// CONNECT`, stack/build/back-to-top — no changes.

---

## 8. `SITE_DESCRIPTION` (`src/consts.ts`)

**Current:**
> "Ervin Pangilinan — full-stack developer building reliable web platforms with TypeScript, Next.js, and Node. Currently shipping at Cosmic Society. Open to opportunities."

**New:**
> "Ervin Pangilinan — full-stack developer in Manila, currently building event software at Cosmic Society. Five years of writing code, mostly TypeScript and Node. Tinkering with Rust, AI workflows, and whatever else catches the eye."

`SITE_TITLE` stays unchanged.

---

## 9. What stays exactly the same

- `feat/recruiter-pass-redesign` branch (this passion-pass work stacks on top in additional commits — no rebase)
- Astro 6 framework, build/deploy config
- Theme system (light + dark CSS custom properties, `data-theme` toggle, `SwitchTheme.tsx`)
- All accessibility scaffolding: skip link, ARIA labels, schema.org markup, `prefers-reduced-motion`, focus indicators
- Numbered section labels (`SectionLabel.astro` component, `01–04`)
- All GSAP scroll-blur animations and ScrollTrigger setup
- Layout, spacing, typography, color tokens — no value changes
- BaseHead schema.org `Person` JSON-LD (the source of truth)
- Custom cursor, theme toggle, skip link
- Experience section in full (timeline, numbered pill markers, `// NOW` badge, summary + outcome bullets, Cosmic Society / HEQS / FiveTwenty / Self-Employed / Student Projects / Self-taught entries)
- Stack tier visual treatment, weight gradient
- Footer 4-column grid below the CTA block
- Resume PDF file at `public/Ervin_Pangilinan_Resume.pdf` (stays — URL still resolves for anyone with it; we just stop linking to it from the UI)

---

## 10. Out of scope

- Adding new sections (no blog, no "things I'm reading," no manifesto block — those would be future work)
- Restructuring layout, grid, or component boundaries
- Changing fonts, colors, or theme tokens
- Replacing or removing GSAP / ScrollTrigger
- Modifying the JSON-LD `Person` schema in `BaseHead.astro` beyond what aligns with the new `SITE_DESCRIPTION` if needed
- Splitting the spec into multiple plans — this is one focused content + small-structural pass
- Adding a contact form or analytics
- Tests (no test runner exists in the project)

---

## 11. Acceptance Criteria

A successful pass meets all of the following:

1. The hero displays `// CURRENTLY · Cosmic Society · Manila` as its status line, the new tagline, and a `// Currently exploring` block (no `// Signals` strip, no `Download CV` button)
2. The NavBar has no `Resume ↓` button on desktop or mobile
3. The About section shows the rewritten prose, no `// Currently learning` strip
4. The Stack section's subhead reads "Tools I work with — sorted by how often I actually reach for them."
5. Project cards no longer show `// MY ROLE` or `// IMPACT` mono lines; descriptions read in conversational first person
6. The Footer CTA block reads `// Say hi` / "Want to talk about code, projects, or anything in between?" with two buttons (Email + LinkedIn). Resume button is gone.
7. `SITE_DESCRIPTION` matches the new copy
8. `npm run build` completes clean
9. `npx astro check` reports zero errors
10. No references in code to `Resume`, `CV download`, "Open to opportunities", or "Looking for a full-stack developer" remain in any visible UI
11. Existing accessibility, SEO, theming, reduced-motion behavior preserved

---

## 12. Open questions / placeholders for user input

- **`// Currently exploring` content**: spec uses placeholders (`Rust ownership model · Server-side AI workflows · Cleaner test architecture`). User should swap in three honest items reflecting actual current tinkering. Lower-stakes than copy elsewhere because it's expected to update over time anyway.
- **Tagline final sentence (`...currently TypeScript, Next.js, Supabase, and learning Rust on the side`)**: confirm Rust is what you want to flag publicly as the side-project language. If it's something else (Go, Zig, Bun internals, etc.), swap. If you're not actively learning a new language right now, drop the `, and learning Rust on the side` clause and let the tagline end at `Supabase`.
- **Status line format `// CURRENTLY · Cosmic Society · Manila`**: confirm this format. Alternative considered: `// AT COSMIC SOCIETY · MANILA` (more compact, doesn't need the "CURRENTLY" word).
- **`SITE_DESCRIPTION` "Five years of writing code"**: this is a literal time count from 2021. If you'd rather phrase as "since 2021" or "more than four years" etc., swap.
- **Resume file**: keeping the PDF at `public/Ervin_Pangilinan_Resume.pdf` so the URL resolves. Confirm — alternative is to delete the file too. Recommended: keep the file.
