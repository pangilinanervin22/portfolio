# Portfolio Passion-Pass Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the portfolio from "recruiter conversion" to "personal craft showcase" per `docs/superpowers/specs/2026-05-03-portfolio-passion-pass-design.md`. Strip job-seeking signals (status line, CTA pitch, CV/Resume buttons, `// Signals` CV-stat strip) and replace with curious-builder voice (`// CURRENTLY` status, `// Currently exploring` block, conversational tagline, first-person project descriptions, `// Say hi` footer).

**Architecture:** Content + small structural deletions across 6 files. No layout changes, no new components, no theme changes. Stacks on top of the recruiter-pass redesign already on `feat/recruiter-pass-redesign`.

**Tech Stack:** Astro 6, TypeScript, scoped CSS (CSS custom properties), GSAP + ScrollTrigger (preserved unchanged).

**Verification model:** No test runner. Each task verifies via:
1. `npm run build` — must complete clean (no TypeScript / Astro errors)
2. `npx astro check` — zero errors at the end of each task that touches code
3. Live dev server check at `http://localhost:4321/` — Playwright screenshot to confirm visual result

---

## Files Touched

**Modified files:**
- `src/consts.ts` — `SITE_DESCRIPTION` rewrite
- `src/components/Welcome.astro` — hero rewrite (status line, tagline, drop CV button, drop Signals strip, add Currently exploring block)
- `src/components/NavBar.astro` — drop `<li class="nav-resume">` and associated CSS
- `src/components/introduction/Introduction.astro` — prose rewrite, drop `// Currently learning` strip and its CSS, update GSAP target list
- `src/components/technology/Technology.astro` — subhead text change
- `src/data/projects.ts` — drop `role?` and `impact?` fields, rewrite all 4 project descriptions
- `src/components/projects/ProjectCard.astro` — drop `<dl class="meta-lines">` block + associated CSS
- `src/components/projects/Projects.astro` — subhead text change
- `src/components/Footer.astro` — CTA block copy rewrite + drop Resume button + drop `<p class="cta-sub">`

**No new files.**

---

## Pre-flight

- [ ] **Step P1: Confirm branch and clean working tree**

```powershell
git -C E:/other/portfolio branch --show-current
git -C E:/other/portfolio status --short
```
Expected: branch is `feat/recruiter-pass-redesign`. Status shows untracked screenshot files only (`.playwright-mcp/`, `qa-*.png`, `hero-*.png`, etc.) — no modified source files.

- [ ] **Step P2: Confirm clean baseline build**

```powershell
npm run build
```
Expected: success. Zero errors, two pages emitted.

- [ ] **Step P3: Confirm spec is on disk**

```powershell
Test-Path E:/other/portfolio/docs/superpowers/specs/2026-05-03-portfolio-passion-pass-design.md
```
Expected: `True`. The spec was committed in `e11c054`.

---

## Task 1: Update `SITE_DESCRIPTION`

Quick one-line copy change. The new description drops "Open to opportunities" and reads as a developer's bio rather than a candidate pitch.

**Files:**
- Modify: `src/consts.ts`

- [ ] **Step 1.1: Replace `SITE_DESCRIPTION`**

Edit `src/consts.ts`. The file should read exactly:

```typescript
export const SITE_TITLE = "Ervin Pangilinan";
export const SITE_DESCRIPTION = "Ervin Pangilinan — full-stack developer in Manila, currently building event software at Cosmic Society. Five years of writing code, mostly TypeScript and Node. Tinkering with Rust, AI workflows, and whatever else catches the eye.";
```

`SITE_TITLE` stays unchanged.

- [ ] **Step 1.2: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 1.3: Commit**

```powershell
git -C E:/other/portfolio add src/consts.ts
git -C E:/other/portfolio commit -m "content: rewrite SITE_DESCRIPTION for passion-pass voice"
```
**No `Co-Authored-By` trailer.**

---

## Task 2: Hero rewrite (`Welcome.astro`)

The biggest task. Status line changes, tagline rewrites, primary CV button is removed, the `// Signals` strip is replaced with a `// Currently exploring` block, and unused frontmatter computations are deleted.

**Files:**
- Modify: `src/components/Welcome.astro`

- [ ] **Step 2.1: Replace the file**

Overwrite `src/components/Welcome.astro` with:

```astro
---
import Border from "./_common/Border.astro";
import GithubIcon from "../assets/icons/github.svg";
import LinkedinIcon from "../assets/icons/linkedin.svg";
import EmailIcon from "../assets/icons/email.svg";
---

<Border aria-hidden="true" />
<section
        id="welcome"
        class="hero"
        aria-labelledby="welcome-heading"
        itemscope
        itemtype="https://schema.org/Person"
>
        <div class="hero-inner">
                <header class="content">
                        <p class="status" aria-label="Current state">
                                <span class="status-mark" aria-hidden="true">//</span>
                                <span class="status-text">CURRENTLY</span>
                                <span class="status-sep" aria-hidden="true">·</span>
                                <span class="status-loc">Cosmic Society</span>
                                <span class="status-sep" aria-hidden="true">·</span>
                                <span class="status-loc">Manila</span>
                        </p>

                        <h1 id="welcome-heading" itemprop="name" class="name">
                                Ervin Pangilinan
                        </h1>

                        <p class="tagline" itemprop="description">
                                I've been writing software since 2021. Today I build event-management things at
                                <span class="tagline-mark">Cosmic Society</span>
                                and chase whatever rabbit hole catches my attention — currently
                                <span class="tagline-mark">TypeScript</span>,
                                <span class="tagline-mark">Next.js</span>,
                                <span class="tagline-mark">Supabase</span>,
                                and learning <span class="tagline-mark">Rust</span> on the side.
                        </p>

                        <div class="accent-line" aria-hidden="true"></div>

                        <div class="actions">
                                <nav class="text-links" aria-label="Contact links">
                                        <a
                                                href="mailto:pangilinanervin22@gmail.com"
                                                class="text-link"
                                                aria-label="Email"
                                                itemprop="email"
                                        >
                                                <EmailIcon class="text-link-icon" aria-hidden="true" />
                                                <span>Email</span>
                                        </a>
                                        <a
                                                href="https://github.com/pangilinanervin22"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-link"
                                                aria-label="GitHub"
                                                itemprop="sameAs"
                                        >
                                                <GithubIcon class="text-link-icon" aria-hidden="true" />
                                                <span>GitHub</span>
                                        </a>
                                        <a
                                                href="https://www.linkedin.com/in/ervin-pangilinan-9b9410231"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-link"
                                                aria-label="LinkedIn"
                                                itemprop="sameAs"
                                        >
                                                <LinkedinIcon class="text-link-icon" aria-hidden="true" />
                                                <span>LinkedIn</span>
                                        </a>
                                </nav>
                        </div>

                        <div class="exploring" aria-label="Currently exploring">
                                <p class="exploring-label">
                                        <span aria-hidden="true">//</span> Currently exploring
                                </p>
                                <ul class="exploring-list">
                                        <li>Rust ownership model</li>
                                        <li><span aria-hidden="true">·</span> Server-side AI workflows</li>
                                        <li><span aria-hidden="true">·</span> Cleaner test architecture</li>
                                </ul>
                        </div>
                </header>
        </div>

        <a class="scroll-hint" href="#introduction" aria-label="Scroll to About section">
                <svg width="14" height="9" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                        <path d="M1 1L8 8L15 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="scroll-hint-label">01 / About</span>
        </a>
</section>
<Border aria-hidden="true" />

<style>
        .hero {
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
                min-height: 90vh;
                padding: 4rem 1.5rem 5rem;
        }

        .hero-inner {
                width: min(1180px, 92%);
                margin-inline: auto;
                display: grid;
                grid-template-columns: minmax(0, 1fr);
        }

        .content {
                max-width: 760px;
                width: 100%;
        }

        /* Status line */
        .status {
                font-family: var(--font-mono);
                font-size: 0.78rem;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: var(--color-text-muted);
                margin: 0 0 2rem;
                line-height: 1;
                display: inline-flex;
                align-items: baseline;
                gap: 0.45rem;
                opacity: 0;
                animation: fadeSlideUp 0.6s ease 0.1s forwards;
        }

        .status-mark {
                color: var(--color-text-secondary);
                opacity: 0.7;
        }

        .status-text {
                color: var(--color-text-primary);
                font-weight: 600;
        }

        .status-sep {
                opacity: 0.4;
        }

        .status-loc {
                color: var(--color-text-secondary);
        }

        /* Name */
        .name {
                font-family: 'Outfit Variable', sans-serif;
                font-size: clamp(3rem, 8vw, 6rem);
                font-weight: 700;
                letter-spacing: -0.04em;
                line-height: 1;
                color: var(--color-text-primary);
                margin: 0 0 1.5rem;
                opacity: 0;
                animation: fadeSlideUp 0.7s ease 0.2s forwards;
        }

        /* Tagline */
        .tagline {
                font-size: clamp(1.05rem, 1.6vw, 1.3rem);
                font-weight: 400;
                line-height: 1.5;
                color: var(--color-text-secondary);
                max-width: 60ch;
                margin: 0 0 1.5rem;
                opacity: 0;
                animation: fadeSlideUp 0.7s ease 0.32s forwards;
        }

        .tagline-mark {
                color: var(--color-text-primary);
                font-weight: 500;
        }

        /* Accent line */
        .accent-line {
                width: 0;
                height: 1.5px;
                background: var(--color-text-primary);
                margin: 0 0 2rem 0;
                opacity: 0;
                animation: lineReveal 0.7s ease 0.45s forwards;
        }

        @keyframes lineReveal {
                from { width: 0; opacity: 0; }
                to { width: 80px; opacity: 0.5; }
        }

        /* Actions row */
        .actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 1.5rem 2rem;
                margin: 0 0 3rem;
                opacity: 0;
                animation: fadeSlideUp 0.7s ease 0.55s forwards;
        }

        .text-links {
                display: flex;
                flex-wrap: wrap;
                gap: 1.4rem;
                align-items: center;
        }

        .text-link {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                font-family: var(--font-mono);
                font-size: 0.82rem;
                color: var(--color-text-secondary);
                text-decoration: none;
                transition: color 0.2s ease;
        }

        .text-link:hover {
                color: var(--color-text-primary);
        }

        :global(.text-link-icon) {
                width: 14px;
                height: 14px;
        }

        /* Currently exploring */
        .exploring {
                opacity: 0;
                animation: fadeSlideUp 0.7s ease 0.7s forwards;
        }

        .exploring-label {
                font-family: var(--font-mono);
                font-size: 0.72rem;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: var(--color-text-muted);
                margin: 0 0 0.4rem;
                line-height: 1;
        }

        .exploring-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                gap: 0.55rem 0.85rem;
                font-family: var(--font-mono);
                font-size: 0.78rem;
                color: var(--color-text-secondary);
        }

        .exploring-list li {
                display: inline-flex;
                align-items: baseline;
                gap: 0.55rem;
        }

        /* Scroll hint */
        .scroll-hint {
                position: absolute;
                bottom: 1.75rem;
                left: 50%;
                transform: translateX(-50%);
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                gap: 0.45rem;
                color: var(--color-text-muted);
                text-decoration: none;
                opacity: 0;
                animation: fadeSlideUp 0.7s ease 0.95s forwards;
        }

        .scroll-hint svg {
                animation: gentle-bounce 2.4s ease-in-out 1.6s infinite;
        }

        .scroll-hint-label {
                font-family: var(--font-mono);
                font-size: 0.7rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--color-text-muted);
        }

        .scroll-hint:hover {
                color: var(--color-text-primary);
        }

        @keyframes gentle-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(4px); }
        }

        @keyframes fadeSlideUp {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile */
        @media (max-width: 768px) {
                .hero {
                        padding: 2.5rem 1.25rem 4rem;
                        min-height: 92vh;
                }
                .actions {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1.25rem;
                        margin-bottom: 2.5rem;
                }
                .text-links {
                        gap: 1rem;
                }
        }

        @media (max-width: 480px) {
                .name {
                        font-size: clamp(2.6rem, 13vw, 4rem);
                }
                .tagline {
                        font-size: 1rem;
                }
                .exploring-list {
                        font-size: 0.72rem;
                }
        }

        @media (prefers-reduced-motion: reduce) {
                .status,
                .name,
                .tagline,
                .actions,
                .exploring,
                .scroll-hint {
                        animation: none;
                        opacity: 1;
                }
                .accent-line {
                        animation: none;
                        opacity: 0.5;
                        width: 80px;
                }
                .scroll-hint svg {
                        animation: none;
                }
                .text-link {
                        transition: none;
                }
        }
</style>
```

**Differences from prior version:**
- Frontmatter: removed `import { projects }`, removed `yearsCoding` / `projectCount` / `updatedLabel` constants
- Status line: 6 spans instead of 4 (`Cosmic Society · Manila` two locations); `aria-label` changed to `"Current state"`
- Tagline: full rewrite with 5 `tagline-mark` highlights instead of 2; `max-width: 60ch` instead of `56ch`
- `<a class="btn-primary">` removed entirely; `.actions` div now wraps only the `<nav class="text-links">`
- `.signals` block renamed to `.exploring` with new content (`// Currently exploring` + 3 placeholder items)
- All `.btn-primary`, `.btn-arrow`, `.signals*` CSS rules removed
- New `.exploring*` CSS rules added (same visual treatment as old `.signals*`)
- Reduced-motion block updated: removed `.btn-primary, .text-link, .btn-arrow` selectors; added `.exploring`; kept `.text-link` `transition: none`

- [ ] **Step 2.2: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 2.3: Verify type check**

```powershell
npx astro check
```
Expected: zero errors.

- [ ] **Step 2.4: Visual verify**

Take a Playwright screenshot at `http://localhost:4321/` (1440×900). Expected:
- Status line at top reads `// CURRENTLY · Cosmic Society · Manila`
- Large name `Ervin Pangilinan`
- New tagline ending in "...and learning Rust on the side."
- Three text links (Email · GitHub · LinkedIn) — NO `Download CV` button
- `// Currently exploring` block with three items
- Scroll hint with `↓ 01 / About`

- [ ] **Step 2.5: Commit**

```powershell
git -C E:/other/portfolio add src/components/Welcome.astro
git -C E:/other/portfolio commit -m "feat(hero): swap CV pitch for // CURRENTLY status, conversational tagline, // Currently exploring block"
```
**No Co-Authored-By trailer.**

---

## Task 3: Drop Resume button from NavBar

Removes the `<li class="nav-resume">` block and its associated CSS rules. The active-section indicator script and all other nav features stay.

**Files:**
- Modify: `src/components/NavBar.astro`

- [ ] **Step 3.1: Remove the markup block**

In `src/components/NavBar.astro`, find this block inside the `<ul class="nav-list">`:

```astro
                <li class="nav-resume" role="none">
                        <a
                                class="resume-btn"
                                href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/Ervin_Pangilinan_Resume.pdf`}
                                download="Ervin_Pangilinan_Resume.pdf"
                                aria-label="Download CV"
                                role="menuitem"
                        >
                                Resume <span aria-hidden="true">↓</span>
                        </a>
                </li>
```

Delete it entirely. The line immediately before it (`<li role="none"><a ... data-section="footer">Contact</a></li>`) stays. The line immediately after it (`<li class="theme-switch"><SwitchTheme client:load /></li>`) stays.

- [ ] **Step 3.2: Remove the CSS rules**

In the `<style>` block, find and delete the following rules entirely:

```css
        /* Resume button (desktop) */
        .nav-resume .resume-btn {
                display: inline-flex;
                align-items: center;
                gap: 0.35rem;
                padding: 0.45rem 0.9rem;
                font-family: var(--font-mono);
                font-size: 0.78rem;
                font-weight: 500;
                color: var(--color-text-inverse) !important;
                background: var(--color-accent);
                border: 1px solid var(--color-accent);
                border-radius: 6px;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-resume .resume-btn:hover {
                background: var(--color-accent-hover);
                border-color: var(--color-accent-hover);
                opacity: 1;
                transform: translateY(-1px);
        }

        @media (max-width: 768px) {
                .nav-resume .resume-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 0.6rem 0.9rem;
                }
        }
```

- [ ] **Step 3.3: Update reduced-motion rule**

Find this `prefers-reduced-motion` rule:

```css
        @media (prefers-reduced-motion: reduce) {
                .nav-list li a[data-section]::after,
                .nav-resume .resume-btn {
                        transition: none;
                }
        }
```

Replace with (drop `.nav-resume .resume-btn` selector, keep the data-section underline):

```css
        @media (prefers-reduced-motion: reduce) {
                .nav-list li a[data-section]::after {
                        transition: none;
                }
        }
```

- [ ] **Step 3.4: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 3.5: Verify Resume is gone**

```powershell
Select-String -Path E:/other/portfolio/src/components/NavBar.astro -Pattern "resume|nav-resume|Resume"
```
Expected: no matches (case-insensitive). The file should contain zero references to Resume.

- [ ] **Step 3.6: Commit**

```powershell
git -C E:/other/portfolio add src/components/NavBar.astro
git -C E:/other/portfolio commit -m "feat(nav): remove Resume button to drop job-hunt framing"
```
**No Co-Authored-By trailer.**

---

## Task 4: About prose rewrite + drop `// Currently learning` strip

Two paragraphs of new copy in the About section, plus removal of the `// Currently learning` strip (now lives in the hero as `// Currently exploring`).

**Files:**
- Modify: `src/components/introduction/Introduction.astro`

- [ ] **Step 4.1: Rewrite the prose**

In `src/components/introduction/Introduction.astro`, find this block:

```astro
                <p class="introduction-description" itemprop="description">
                        I started writing code in 2021. Today I ship full-stack web platforms for Cosmic Society, with prior production work at HEQS Group and FiveTwenty IT Services and a Computer Science degree from Cavite State University.
                </p>
                <p class="introduction-description-secondary">
                        I work across the stack but lean toward backend depth — REST APIs, role-based access, audit logging, query optimization, CI/CD. I care about clean architecture, accessibility, and code the next person can read.
                </p>
```

Replace with:

```astro
                <p class="introduction-description" itemprop="description">
                        I write software, mostly for the web. Started in 2021 and haven't stopped. Today I'm at Cosmic Society building an event-management platform — before that, HEQS Group and FiveTwenty IT Services. Computer Science grad from Cavite State University.
                </p>
                <p class="introduction-description-secondary">
                        I work across the stack but lean toward backend depth — REST APIs, role-based access, audit logging, query optimization, CI/CD. I care about clean architecture, accessibility, and code the next person can read. The rest of my time goes to whatever I'm currently learning.
                </p>
```

- [ ] **Step 4.2: Remove the `// Currently learning` strip**

In the same file, find and delete this entire block:

```astro
                <div class="learning-strip" aria-label="Currently learning">
                        <p class="learning-label">
                                <span aria-hidden="true">//</span> Currently learning
                        </p>
                        <ul class="learning-list">
                                <li>Rust</li>
                                <li><span aria-hidden="true">·</span> Server Actions in Next 16</li>
                                <li><span aria-hidden="true">·</span> LLM workflow design</li>
                        </ul>
                </div>
```

- [ ] **Step 4.3: Remove the strip's CSS**

In the `<style>` block, find and delete the following rules entirely:

```css
        /* Learning strip */
        .learning-strip {
                width: 100%;
                margin-top: 1rem;
        }

        .learning-label {
                font-family: var(--font-mono);
                font-size: 0.72rem;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: var(--color-text-muted);
                margin: 0 0 0.4rem;
                line-height: 1;
        }

        .learning-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                gap: 0.4rem 0.85rem;
                font-family: var(--font-mono);
                font-size: 0.78rem;
                color: var(--color-text-secondary);
        }

        .learning-list li {
                display: inline-flex;
                align-items: baseline;
                gap: 0.55rem;
        }
```

- [ ] **Step 4.4: Update GSAP target list**

In the `<script>` block at the bottom of the file, find this line:

```javascript
                const targets = container.querySelectorAll(
                        ".section-head, .introduction-image, .introduction-description, .introduction-description-secondary, .learning-strip, .introduction-skills"
                );
```

Replace with (drop `.learning-strip` token):

```javascript
                const targets = container.querySelectorAll(
                        ".section-head, .introduction-image, .introduction-description, .introduction-description-secondary, .introduction-skills"
                );
```

- [ ] **Step 4.5: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 4.6: Verify learning-strip is gone**

```powershell
Select-String -Path E:/other/portfolio/src/components/introduction/Introduction.astro -Pattern "learning-"
```
Expected: no matches.

- [ ] **Step 4.7: Commit**

```powershell
git -C E:/other/portfolio add src/components/introduction/Introduction.astro
git -C E:/other/portfolio commit -m "content(about): rewrite prose, drop // Currently learning strip"
```
**No Co-Authored-By trailer.**

---

## Task 5: Stack subhead text change

Single-line copy change.

**Files:**
- Modify: `src/components/technology/Technology.astro`

- [ ] **Step 5.1: Update the subhead**

In `src/components/technology/Technology.astro`, find:

```astro
                <p class="tech-intro">
                        What I reach for, in rough order of frequency.
                </p>
```

Replace with:

```astro
                <p class="tech-intro">
                        Tools I work with — sorted by how often I actually reach for them.
                </p>
```

- [ ] **Step 5.2: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 5.3: Commit**

```powershell
git -C E:/other/portfolio add src/components/technology/Technology.astro
git -C E:/other/portfolio commit -m "content(stack): warmer first-person subhead"
```
**No Co-Authored-By trailer.**

---

## Task 6: Projects content — drop role/impact, rewrite descriptions

Three files together because they're tightly coupled (interface change drives both data file and component changes).

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/components/projects/ProjectCard.astro`
- Modify: `src/components/projects/Projects.astro`

- [ ] **Step 6.1: Update `src/data/projects.ts`**

Overwrite the file with:

```typescript
import DemoImageInventory from "../assets/projects/inventory.png";
import timekeeping from "../assets/projects/timekeeping.png";
import greenCycle from "../assets/projects/greenCycle.png";
import fairWrite from "../assets/projects/fairwrite.png";

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

export const projects: ProjectItem[] = [
        {
                title: "Paysera Timekeeping System",
                description:
                        "Internship at FiveTwenty: a small team built a timekeeping platform. I owned the backend — role-based access, audit logging, API design, performance tuning, automated tests. It's in daily production use by FiveTwenty's enterprise clients.",
                stack: [
                        "React",
                        "ShadCN",
                        "Express",
                        "Prisma",
                        "PostgreSQL",
                        "TypeScript",
                        "Docker",
                        "Jest",
                        "Supertest",
                        "DigitalOcean",
                ],
                year: "2024 – 2025",
                image: timekeeping,
                imageAlt: "image of paysera timekeeping system",
        },
        {
                title: "Fair Write (Gender Fair Revision)",
                description:
                        "Group thesis project — a writing tool that flags biased terms and suggests inclusive alternatives in real time. I worked on the backend and NLP side: REST APIs, the bias-detection pipeline, and the LanguageTool + spaCy integration. Live demo's still online.",
                stack: [
                        "Svelte",
                        "Tailwind",
                        "Prosemirror",
                        "FastAPI",
                        "LanguageTool",
                        "spaCy",
                ],
                year: "2024 – 2025",
                repo: "https://github.com/Fair-Write",
                demo: "https://fairwrite.netlify.app/",
                image: fairWrite,
                imageAlt: "image of fair write a gender fair revision web application",
        },
        {
                title: "Ajapco Sales & Inventory System",
                description:
                        "Freelance project — a sales and inventory system for a Japanese sweets shop. Built solo, full stack.",
                stack: ["React", "Node.js", "Express", "MySQL"],
                year: "2023",
                repo: "https://github.com/pangilinanervin22/inventory_react",
                demo: "https://pangilinanervin22.github.io/inventory_react/",
                image: DemoImageInventory,
                imageAlt: "image of ajapco sales and inventory system",
        },
        {
                title: "GreenCycle Mobile App",
                description:
                        "Freelance project — a recycling app I built solo. Online-first backend with offline support and tested cloud↔local sync across Android and iOS.",
                stack: ["React Native", "Expo", "Supabase", "TypeScript"],
                year: "2025",
                repo: "https://github.com/pangilinanervin22/GreenCycle",
                image: greenCycle,
                imageAlt: "image of greencycle a recycling mobile app",
        },
];
```

(Differences: `ProjectItem` no longer has `role?` or `impact?`. All four entries lose those fields. All four `description` strings are rewritten.)

- [ ] **Step 6.2: Update `src/components/projects/ProjectCard.astro`**

Open the file. Locate the `Props` interface:

```astro
interface Props {
        project: ProjectItem;
        index: number;
        featured?: boolean;
}
```

This stays. Locate the destructuring:

```astro
const { project: p, index: i, featured = false } = Astro.props as Props;
```

This also stays. Now find the entire `<dl class="meta-lines">` block in the markup:

```astro
                        {(p.role || p.impact) && (
                                <dl class="meta-lines">
                                        {p.role && (
                                                <div class="meta-row">
                                                        <dt><span aria-hidden="true">//</span> MY ROLE</dt>
                                                        <dd>{p.role}</dd>
                                                </div>
                                        )}
                                        {p.impact && (
                                                <div class="meta-row">
                                                        <dt><span aria-hidden="true">//</span> IMPACT</dt>
                                                        <dd>{p.impact}</dd>
                                                </div>
                                        )}
                                </dl>
                        )}
```

Delete this entire block. The structure of the card body becomes: `<header>` → `<p class="card-desc">` → `<ul class="stack">` → `<nav class="links">`. (No more meta-lines between header and description.)

Now find the associated CSS rules in the `<style>` block:

```css
        /* // MY ROLE / // IMPACT meta lines */
        .meta-lines {
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 0.35rem;
        }

        .meta-row {
                display: grid;
                grid-template-columns: 6.5rem 1fr;
                gap: 0.75rem;
                align-items: baseline;
                font-family: var(--font-mono);
                font-size: 0.78rem;
                line-height: 1.5;
        }

        .meta-row dt {
                color: var(--color-text-muted);
                font-weight: 500;
                letter-spacing: 0.05em;
                margin: 0;
        }

        .meta-row dd {
                color: var(--color-text-secondary);
                margin: 0;
        }

        @media (max-width: 520px) {
                .meta-row {
                        grid-template-columns: 1fr;
                        gap: 0.15rem;
                }
        }
```

Delete all of these. Nothing references `.meta-lines`, `.meta-row`, `.meta-row dt`, or `.meta-row dd` anymore.

- [ ] **Step 6.3: Update `src/components/projects/Projects.astro` subhead**

Find:

```astro
                <p class="section-intro">
                        Selected work from internship, freelance, and academic projects. Each shipped to real users.
                </p>
```

Replace with:

```astro
                <p class="section-intro">
                        Things I've built — internship, freelance, and a couple of academic projects.
                </p>
```

- [ ] **Step 6.4: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 6.5: Verify type check**

```powershell
npx astro check
```
Expected: zero errors. (If any references to `p.role` or `p.impact` were missed, this catches them.)

- [ ] **Step 6.6: Verify role/impact references gone**

```powershell
Select-String -Path E:/other/portfolio/src/data/projects.ts,E:/other/portfolio/src/components/projects/ProjectCard.astro,E:/other/portfolio/src/components/projects/Projects.astro -Pattern "MY ROLE|IMPACT|p\.role|p\.impact|meta-lines|meta-row"
```
Expected: no matches.

- [ ] **Step 6.7: Visual verify**

Take a Playwright screenshot at `http://localhost:4321/#projects`. Expected:
- Featured Paysera card shows description starting "Internship at FiveTwenty: a small team built a timekeeping platform. I owned the backend..." — no `// MY ROLE` or `// IMPACT` lines anywhere
- Other 3 cards show their first-person descriptions
- Subhead reads "Things I've built — internship, freelance, and a couple of academic projects."

- [ ] **Step 6.8: Commit**

```powershell
git -C E:/other/portfolio add src/data/projects.ts src/components/projects/ProjectCard.astro src/components/projects/Projects.astro
git -C E:/other/portfolio commit -m "content(work): drop // MY ROLE / // IMPACT, rewrite descriptions in first person"
```
**No Co-Authored-By trailer.**

---

## Task 7: Footer CTA copy + drop Resume button

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 7.1: Update the CTA block markup**

In `src/components/Footer.astro`, find the entire `<section class="cta-block">` block:

```astro
        <section class="cta-block" aria-labelledby="cta-heading">
                <p class="cta-label">
                        <span aria-hidden="true">//</span> Open to opportunities
                </p>
                <h3 id="cta-heading" class="cta-headline">
                        Looking for a full-stack developer comfortable
                        across the stack and shipping?
                </h3>
                <p class="cta-sub">Let's talk.</p>
                <div class="cta-actions">
                        <a
                                class="cta-btn cta-btn--primary"
                                href="mailto:pangilinanervin22@gmail.com"
                        >
                                pangilinanervin22@gmail.com
                                <span aria-hidden="true">→</span>
                        </a>
                        <a
                                class="cta-btn"
                                href="https://www.linkedin.com/in/ervin-pangilinan-9b9410231"
                                target="_blank"
                                rel="noopener noreferrer"
                        >
                                LinkedIn <span aria-hidden="true">→</span>
                        </a>
                        <a
                                class="cta-btn"
                                href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/Ervin_Pangilinan_Resume.pdf`}
                                download="Ervin_Pangilinan_Resume.pdf"
                        >
                                Resume <span aria-hidden="true">↓</span>
                        </a>
                </div>
        </section>
```

Replace with:

```astro
        <section class="cta-block" aria-labelledby="cta-heading">
                <p class="cta-label">
                        <span aria-hidden="true">//</span> Say hi
                </p>
                <h3 id="cta-heading" class="cta-headline">
                        Want to talk about code, projects, or anything in between?
                </h3>
                <div class="cta-actions">
                        <a
                                class="cta-btn cta-btn--primary"
                                href="mailto:pangilinanervin22@gmail.com"
                        >
                                pangilinanervin22@gmail.com
                                <span aria-hidden="true">→</span>
                        </a>
                        <a
                                class="cta-btn"
                                href="https://www.linkedin.com/in/ervin-pangilinan-9b9410231"
                                target="_blank"
                                rel="noopener noreferrer"
                        >
                                LinkedIn <span aria-hidden="true">→</span>
                        </a>
                </div>
        </section>
```

(Differences: label `// Open to opportunities` → `// Say hi`; headline rewritten; `<p class="cta-sub">Let's talk.</p>` deleted; Resume button anchor deleted; only Email + LinkedIn buttons remain.)

- [ ] **Step 7.2: Verify the existing 4-column grid is untouched**

The `<div class="footer-inner">` block below the CTA block stays exactly as-is. Confirm by reading the file — no edits needed there.

- [ ] **Step 7.3: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 7.4: Verify Resume + cta-sub references gone**

```powershell
Select-String -Path E:/other/portfolio/src/components/Footer.astro -Pattern "Resume|Ervin_Pangilinan_Resume\.pdf|cta-sub|Open to opportunities|Looking for a full-stack"
```
Expected: no matches.

- [ ] **Step 7.5: Visual verify**

Scroll to the bottom of `http://localhost:4321/`. Expected:
- CTA block label reads `// Say hi`
- Headline reads "Want to talk about code, projects, or anything in between?"
- No "Let's talk." sub-line
- Two buttons: email (primary monochrome) + LinkedIn (outline)
- No Resume button anywhere

- [ ] **Step 7.6: Commit**

```powershell
git -C E:/other/portfolio add src/components/Footer.astro
git -C E:/other/portfolio commit -m "content(footer): // Say hi CTA, drop Resume button + Let's talk sub"
```
**No Co-Authored-By trailer.**

---

## Task 8: `.cta-sub` CSS cleanup

The `<p class="cta-sub">` element no longer renders. The CSS rule `.cta-sub` becomes dead code.

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 8.1: Remove the `.cta-sub` CSS rule**

In `src/components/Footer.astro`, find this rule in the `<style>` block:

```css
        .cta-sub {
                font-size: 1rem;
                color: var(--color-text-secondary);
                margin: 0;
        }
```

Delete it.

- [ ] **Step 8.2: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 8.3: Commit**

```powershell
git -C E:/other/portfolio add src/components/Footer.astro
git -C E:/other/portfolio commit -m "chore(footer): drop dead .cta-sub CSS rule"
```
**No Co-Authored-By trailer.**

---

## Task 9: Final QA pass

Verify the cumulative work of Tasks 1–8 reads as a passion-pass redesign with zero job-hunt language.

- [ ] **Step 9.1: Clean rebuild**

```powershell
npm run build
```
Expected: success, zero errors, two pages emitted.

- [ ] **Step 9.2: Type check**

```powershell
npx astro check
```
Expected: zero errors, zero warnings, zero hints.

- [ ] **Step 9.3: Verify no job-hunt language remains anywhere in `src/`**

Run each of these greps. All must return zero matches:

```powershell
Select-String -Path E:/other/portfolio/src/**/*.astro,E:/other/portfolio/src/**/*.ts -Pattern "OPEN TO OPPORTUNITIES"
Select-String -Path E:/other/portfolio/src/**/*.astro,E:/other/portfolio/src/**/*.ts -Pattern "Open to opportunities"
Select-String -Path E:/other/portfolio/src/**/*.astro,E:/other/portfolio/src/**/*.ts -Pattern "Download CV"
Select-String -Path E:/other/portfolio/src/**/*.astro,E:/other/portfolio/src/**/*.ts -Pattern "Looking for a full-stack"
Select-String -Path E:/other/portfolio/src/**/*.astro,E:/other/portfolio/src/**/*.ts -Pattern "Ervin_Pangilinan_Resume"
Select-String -Path E:/other/portfolio/src/**/*.astro,E:/other/portfolio/src/**/*.ts -Pattern "MY ROLE"
Select-String -Path E:/other/portfolio/src/**/*.astro,E:/other/portfolio/src/**/*.ts -Pattern "// Signals"
```

If any of these return matches, investigate before proceeding.

- [ ] **Step 9.4: Visual screenshots at three viewports**

Use Playwright. Navigate to `http://localhost:4321/`. Take FULL-PAGE screenshots at:
- 1440 × 900 → `qa-passion-desktop.png`
- 820 × 1180 → `qa-passion-tablet.png`
- 390 × 844 → `qa-passion-mobile.png`

Verify each:
- Hero: status `// CURRENTLY · Cosmic Society · Manila`, new tagline ending in "Rust on the side", three text links (no CV button), `// Currently exploring` block with three items, scroll hint
- About: rewritten prose ("I write software, mostly for the web..."), no `// Currently learning` strip
- Experience: unchanged from prior pass (Cosmic Society on top, // NOW badge, etc.)
- Stack: subhead reads "Tools I work with — sorted by how often I actually reach for them.", four tier rows
- Work: subhead reads "Things I've built — internship, freelance, and a couple of academic projects.", four cards with first-person descriptions, NO `// MY ROLE` or `// IMPACT` lines
- Footer: `// Say hi` label, "Want to talk about code, projects, or anything in between?" headline, two buttons (Email + LinkedIn), no Resume button

- [ ] **Step 9.5: Verify Resume PDF still resolves**

```powershell
curl -I http://localhost:4321/Ervin_Pangilinan_Resume.pdf
```
Expected: 200 OK (the file stays in `public/` even though no UI surfaces it).

- [ ] **Step 9.6: Dark mode check**

Click the theme toggle. Take a desktop screenshot in dark mode → `qa-passion-dark.png`. Verify all text contrast remains adequate, especially the new `// Currently exploring` block and the rewritten Footer CTA.

- [ ] **Step 9.7: Summary report**

Print a short summary:
- Tasks completed: 1–8 + this QA pass
- Build status
- Type check status
- Visual checks pass/fail per viewport
- Open follow-ups for the user (e.g., `// Currently exploring` placeholder content needs real values; tagline's "Rust on the side" should be confirmed or swapped)
- Final branch state
