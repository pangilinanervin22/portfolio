# Portfolio Recruiter-Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the recruiter-pass redesign per `docs/superpowers/specs/2026-05-03-portfolio-recruiter-pass-design.md`. Refine and elevate the existing Astro 6 portfolio for recruiter conversion: dense asymmetric hero, numbered section labels + `//` mono accent identity, tiered stack view, featured-project layout, footer CTA block, plus content rewrites for the new Cosmic Society role.

**Architecture:** No structural changes. Modify existing components in place; introduce one new reusable component (`SectionLabel.astro`); restructure three data files to support new content shapes. All work in `src/`. Theme system, GSAP, accessibility scaffolding, and component boundaries preserved.

**Tech Stack:** Astro 6, TypeScript, scoped CSS (CSS custom properties), GSAP + ScrollTrigger, React 19 (existing islands only — no new React).

**Verification model:** This project has no test runner. Each task verifies via:
1. `npm run build` — must complete clean (no TypeScript / Astro errors)
2. Live dev server check (user has it running at `http://localhost:4321/`) — Playwright screenshot to confirm visual result matches the spec
3. Manual a11y sanity check (focus order, headings, alt text) where the change touches semantics

---

## Files Touched

**New files:**
- `src/components/_common/SectionLabel.astro` — reusable `NN / Title` mono label

**Modified files:**
- `src/consts.ts` — `SITE_DESCRIPTION` rewrite
- `src/components/Welcome.astro` — full hero rewrite (markup + styles + GSAP)
- `src/components/NavBar.astro` — add active-section indicator + Resume button
- `src/components/introduction/Introduction.astro` — section label, reversed layout, new prose, learning strip
- `src/data/experiences.ts` — interface change (`description` → `summary` + `highlights`), new Cosmic Society entry, HEQS end date, weight-grading content
- `src/components/experience/Experience.astro` — render summary + highlights, numbered markers, `// NOW` mono badge
- `src/data/technologies.ts` — replace `skillGroups` with `skillTiers`
- `src/components/technology/Technology.astro` — replace 6-card grid with 4-tier view
- `src/data/projects.ts` — add `role` + `impact` optional fields, fill in for existing projects
- `src/components/projects/ProjectCard.astro` — render `// MY ROLE` / `// IMPACT` lines, add `featured` variant
- `src/components/projects/Projects.astro` — section label, intro line update, render featured-first layout, H2 instead of H1
- `src/components/Footer.astro` — new CTA block on top, copy tightening below

---

## Pre-flight

- [ ] **Step P1: Confirm clean working tree**

```powershell
git status
```
Expected: only the `.claude/` untracked directory (already there) and any test screenshots from Playwright. If there are uncommitted changes to source files, stop and resolve before proceeding.

- [ ] **Step P2: Confirm dev server is reachable**

```powershell
# User should already have `npm run dev` running
curl http://localhost:4321/
```
Expected: HTML response (200). If it fails, ask the user to start `npm run dev`.

- [ ] **Step P3: Confirm a clean baseline build**

```powershell
npm run build
```
Expected: success message ending with `Complete!` and no error output. If the baseline build fails, fix that before proceeding — the changes in this plan should not introduce build failures.

---

## Task 1: Create reusable `SectionLabel` component

Used by About, Experience, Stack, and Projects sections to render the `NN / Title` mono label that anchors each section's top-left.

**Files:**
- Create: `src/components/_common/SectionLabel.astro`

- [ ] **Step 1.1: Create the component**

Write `src/components/_common/SectionLabel.astro`:

```astro
---
interface Props {
        number: string;   // "01", "02", etc.
        label: string;    // "About", "Experience", etc.
        id?: string;      // optional anchor id
}

const { number, label, id } = Astro.props as Props;
---

<p class="section-label" id={id} aria-hidden="true">
        <span class="num">{number}</span>
        <span class="slash" aria-hidden="true"> / </span>
        <span class="lbl">{label}</span>
</p>

<style>
        .section-label {
                font-family: var(--font-mono);
                font-size: 0.75rem;
                font-weight: 500;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--color-text-muted);
                margin: 0 0 1rem 0;
                line-height: 1;
                display: inline-flex;
                align-items: baseline;
                gap: 0.1rem;
        }

        .num {
                color: var(--color-text-secondary);
        }

        .slash {
                opacity: 0.55;
        }

        .lbl {
                color: var(--color-text-muted);
        }
</style>
```

- [ ] **Step 1.2: Verify build**

```powershell
npm run build
```
Expected: success. The component is unused yet but should compile.

- [ ] **Step 1.3: Commit**

```powershell
git add src/components/_common/SectionLabel.astro
git commit -m "feat(common): add SectionLabel component for numbered section markers"
```

---

## Task 2: Update site meta description

Quick string change. Aligns the meta description with the new on-page tone (drops "Sometimes it works, sometimes I learn").

**Files:**
- Modify: `src/consts.ts`

- [ ] **Step 2.1: Replace `SITE_DESCRIPTION`**

Edit `src/consts.ts`:

```typescript
export const SITE_TITLE = "Ervin Pangilinan";
export const SITE_DESCRIPTION = "Ervin Pangilinan — full-stack developer building reliable web platforms with TypeScript, Next.js, and Node. Currently shipping at Cosmic Society. Open to opportunities.";
```

- [ ] **Step 2.2: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 2.3: Verify the meta tag rendered**

```powershell
curl -s http://localhost:4321/ | Select-String -Pattern '<meta name="description"'
```
Expected: the line includes `currently shipping at cosmic society` (case-insensitive). If the dev server caches, refresh it (Astro usually picks up `consts.ts` automatically).

- [ ] **Step 2.4: Commit**

```powershell
git add src/consts.ts
git commit -m "content: tighten SITE_DESCRIPTION for recruiter pass"
```

---

## Task 3: Rewrite Hero (`Welcome.astro`)

Convert the centered, content-light hero into a left-aligned, dense, asymmetric one. Adds status line, specific tagline mentioning Cosmic Society, primary CV button + secondary text links, signal strip with dynamic values, and an updated scroll hint.

**Files:**
- Modify: `src/components/Welcome.astro` (full rewrite)

- [ ] **Step 3.1: Replace the file**

Overwrite `src/components/Welcome.astro` with:

```astro
---
import Border from "./_common/Border.astro";
import GithubIcon from "../assets/icons/github.svg";
import LinkedinIcon from "../assets/icons/linkedin.svg";
import EmailIcon from "../assets/icons/email.svg";
import { projects } from "../data/projects";

const yearsCoding = new Date().getFullYear() - 2021;
const projectCount = projects.length;
const updatedLabel = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
});
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
                        <p class="status" aria-label="Availability status">
                                <span class="status-mark" aria-hidden="true">//</span>
                                <span class="status-text">OPEN TO OPPORTUNITIES</span>
                                <span class="status-sep" aria-hidden="true">·</span>
                                <span class="status-loc">Manila → Remote</span>
                        </p>

                        <h1 id="welcome-heading" itemprop="name" class="name">
                                Ervin Pangilinan
                        </h1>

                        <p class="tagline" itemprop="description">
                                Full-stack developer building reliable web platforms — currently shipping
                                <span class="tagline-mark">Next.js &amp; Supabase</span>
                                at <span class="tagline-mark">Cosmic Society</span>.
                        </p>

                        <div class="accent-line" aria-hidden="true"></div>

                        <div class="actions" role="group" aria-label="Primary actions">
                                <a
                                        class="btn-primary"
                                        href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/Ervin_Pangilinan_Resume.pdf`}
                                        download="Ervin_Pangilinan_Resume.pdf"
                                        aria-label="Download CV"
                                        itemprop="url"
                                >
                                        Download CV
                                        <span class="btn-arrow" aria-hidden="true">→</span>
                                </a>

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

                        <div class="signals" aria-label="Quick signals">
                                <p class="signals-label">
                                        <span aria-hidden="true">//</span> Signals
                                </p>
                                <ul class="signals-list">
                                        <li>~{yearsCoding}y coding</li>
                                        <li><span aria-hidden="true">·</span> 2 production roles</li>
                                        <li><span aria-hidden="true">·</span> {projectCount} shipped projects</li>
                                        <li><span aria-hidden="true">·</span> Updated {updatedLabel}</li>
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

        <script type="application/ld+json" is:inline>
                {
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Ervin Pangilinan",
                        "jobTitle": "Full-stack Developer",
                        "description": "Full-stack developer building reliable web platforms with TypeScript, Next.js, and Node. Currently shipping at Cosmic Society.",
                        "email": "pangilinanervin22@gmail.com",
                        "sameAs": [
                                "https://github.com/pangilinanervin22",
                                "https://www.linkedin.com/in/ervin-pangilinan-9b9410231"
                        ],
                        "knowsAbout": [
                                "Web Development",
                                "Mobile Development",
                                "DevOps",
                                "Full Stack Development"
                        ],
                        "hasOccupation": {
                                "@type": "Occupation",
                                "name": "Full-stack Developer"
                        }
                }
        </script>
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
                max-width: 56ch;
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

        .btn-primary {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.85rem 1.6rem;
                font-family: var(--font-mono);
                font-size: 0.85rem;
                font-weight: 500;
                color: var(--color-text-inverse);
                text-decoration: none;
                border: 1px solid var(--color-accent);
                border-radius: 8px;
                background: var(--color-accent);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary:hover {
                background: var(--color-accent-hover);
                border-color: var(--color-accent-hover);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px var(--color-shadow);
        }

        .btn-primary:hover .btn-arrow {
                transform: translateX(2px);
        }

        .btn-arrow {
                display: inline-block;
                transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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

        .text-link-icon {
                width: 14px;
                height: 14px;
        }

        /* Signals */
        .signals {
                opacity: 0;
                animation: fadeSlideUp 0.7s ease 0.7s forwards;
        }

        .signals-label {
                font-family: var(--font-mono);
                font-size: 0.72rem;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: var(--color-text-muted);
                margin: 0 0 0.4rem;
                line-height: 1;
        }

        .signals-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                gap: 0.55rem 0.85rem;
                font-family: var(--font-mono);
                font-size: 0.78rem;
                color: var(--color-text-muted);
        }

        .signals-list li {
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
                .signals-list {
                        font-size: 0.72rem;
                }
        }

        @media (prefers-reduced-motion: reduce) {
                .status,
                .name,
                .tagline,
                .actions,
                .signals,
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
                .btn-primary,
                .text-link,
                .btn-arrow {
                        transition: none;
                }
        }
</style>
```

- [ ] **Step 3.2: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 3.3: Visual verify in browser**

Use Playwright (or browser) to navigate to `http://localhost:4321/` at 1440×900 viewport. Take a screenshot.

Expected:
- Status line `// OPEN TO OPPORTUNITIES · Manila → Remote` at top-left
- Large name `Ervin Pangilinan` left-aligned
- 3-line tagline mentioning Cosmic Society
- Primary `Download CV →` button + 3 text links (Email/GitHub/LinkedIn) on one row
- Signal strip showing year count, role count, project count, build month-year
- Bottom-center scroll hint with arrow + `01 / About`

Resize to 480×800 and re-screenshot. Expected: layout collapses cleanly, name resizes, actions stack vertically, signals wrap.

- [ ] **Step 3.4: Commit**

```powershell
git add src/components/Welcome.astro
git commit -m "feat(hero): rewrite Welcome to dense asymmetric layout with status, signals, and Cosmic Society tagline"
```

---

## Task 4: Update NavBar — active-section indicator + Resume button

Adds an IntersectionObserver-driven active-section underline to nav links and a `Resume ↓` quick action at the right edge (desktop only — mobile hamburger already covers all options including a new Resume entry).

**Files:**
- Modify: `src/components/NavBar.astro`

- [ ] **Step 4.1: Update markup**

In `src/components/NavBar.astro`, locate the `<ul class="nav-list">` block (around line 30) and replace it with:

```astro
<ul class="nav-list" role="menubar">
        <li role="none"><a href={`${import.meta.env.BASE_URL}#welcome`} role="menuitem" itemprop="url" data-section="welcome">Home</a></li>
        <li role="none"><a href={`${import.meta.env.BASE_URL}#introduction`} role="menuitem" itemprop="url" data-section="introduction">About</a></li>
        <li role="none"><a href={`${import.meta.env.BASE_URL}#experience`} role="menuitem" itemprop="url" data-section="experience">Experience</a></li>
        <li role="none"><a href={`${import.meta.env.BASE_URL}#projects`} role="menuitem" itemprop="url" data-section="projects">Projects</a></li>
        <li role="none"><a href={`${import.meta.env.BASE_URL}#footer`} role="menuitem" itemprop="url" data-section="footer">Contact</a></li>
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
        <li class="theme-switch"><SwitchTheme client:load /></li>
</ul>
```

- [ ] **Step 4.2: Add styles for active state and Resume button**

Inside the `<style>` block of `NavBar.astro`, append the following before the closing `</style>` tag:

```css
        /* Active section underline */
        .nav-list li a[data-section] {
                position: relative;
                padding-bottom: 4px;
        }

        .nav-list li a[data-section]::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 1px;
                background: var(--color-text-primary);
                transform: scaleX(0);
                transform-origin: center;
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
        }

        .nav-list li a[data-section].is-active::after {
                transform: scaleX(1);
                opacity: 1;
        }

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

        @media (prefers-reduced-motion: reduce) {
                .nav-list li a[data-section]::after,
                .nav-resume .resume-btn {
                        transition: none;
                }
        }
```

- [ ] **Step 4.3: Add IntersectionObserver script**

Locate the existing `<script>` block at the bottom of `NavBar.astro` (the scrolled-shadow logic). Replace its contents with the following plain-JavaScript block (no TS annotations, matching the style of other scripts in this codebase):

```javascript
if (typeof window !== "undefined") {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
                let ticking = false;
                window.addEventListener('scroll', () => {
                        if (!ticking) {
                                requestAnimationFrame(() => {
                                        navbar.classList.toggle('scrolled', window.scrollY > 50);
                                        ticking = false;
                                });
                                ticking = true;
                        }
                }, { passive: true });
        }

        // Active-section indicator
        const navLinks = document.querySelectorAll('.nav-list a[data-section]');
        const sectionMap = new Map();
        navLinks.forEach((a) => {
                const id = a.dataset.section;
                if (id) sectionMap.set(id, a);
        });

        const sections = Array.from(sectionMap.keys())
                .map((id) => document.getElementById(id))
                .filter((el) => el !== null);

        if (sections.length) {
                const visible = new Map();
                const observer = new IntersectionObserver(
                        (entries) => {
                                entries.forEach((entry) => {
                                        visible.set(entry.target.id, entry.intersectionRatio);
                                });
                                let bestId = null;
                                let bestRatio = 0;
                                visible.forEach((ratio, id) => {
                                        if (ratio > bestRatio) {
                                                bestRatio = ratio;
                                                bestId = id;
                                        }
                                });
                                navLinks.forEach((a) => a.classList.remove('is-active'));
                                if (bestId) {
                                        const link = sectionMap.get(bestId);
                                        if (link) link.classList.add('is-active');
                                }
                        },
                        { threshold: [0.15, 0.4, 0.7] }
                );
                sections.forEach((s) => observer.observe(s));
        }
}
```

- [ ] **Step 4.4: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 4.5: Visual verify**

Open `http://localhost:4321/` in browser. Scroll through the page. Expected:
- Each nav link gets an underline as you scroll into its section
- Resume button appears at the right edge (between Contact and the theme toggle) with monochrome filled style
- Clicking Resume downloads `Ervin_Pangilinan_Resume.pdf`
- Mobile (resize to 480px): hamburger menu now includes Resume option, full-width

- [ ] **Step 4.6: Commit**

```powershell
git add src/components/NavBar.astro
git commit -m "feat(nav): add active-section indicator and Resume button"
```

---

## Task 5: Restructure About section

Adds the section label, swaps portrait to the left + content to the right (desktop), tightens the H2, replaces the prose, sharpens skill-card copy, and appends the `// Currently learning` strip.

**Files:**
- Modify: `src/components/introduction/Introduction.astro`

- [ ] **Step 5.1: Update frontmatter and markup**

Open `src/components/introduction/Introduction.astro`. Replace the `---` frontmatter import block (lines 1–11) with:

```astro
---
import { Image } from 'astro:assets';
import introImage from "../../assets/me.jpg";
import SkillCard from "./skill_card.astro";
import SectionLabel from "../_common/SectionLabel.astro";

import gameIcon from "../../assets/skill/game.svg";
import webIcon from "../../assets/skill/web.svg";
import mobileIcon from "../../assets/skill/mobile.svg";
import devOpsIcon from "../../assets/skill/devops.svg";
---
```

Then replace the section markup (everything between the closing `---` of frontmatter and the `<style>` opener) with:

```astro
<section
        id="introduction"
        class="introduction-main-container"
        aria-labelledby="about-heading"
        itemscope
        itemtype="https://schema.org/Person"
>
        <div class="section-head">
                <SectionLabel number="01" label="About" />
                <h2 id="about-heading" class="introduction-title" itemprop="name">
                        About
                </h2>
        </div>

        <aside class="introduction-image-container" aria-label="Portrait">
                <figure class="introduction-image" itemscope itemtype="https://schema.org/ImageObject">
                        <Image
                                src={introImage}
                                alt="Ervin Pangilinan - Full Stack Developer and Computer Science Graduate specializing in web applications, mobile development, and DevOps"
                                width={480}
                                height={480}
                                loading="eager"
                                decoding="async"
                                fetchpriority="high"
                                format="webp"
                                quality={85}
                                densities={[1, 1.5, 2]}
                                sizes="(max-width: 480px) 280px, (max-width: 768px) 360px, (max-width: 1024px) 480px, 480px"
                                class="intro-portrait"
                                itemprop="image"
                        />
                        <figcaption class="portrait-caption">
                                <span aria-hidden="true">//</span> Manila, PH · 2026
                        </figcaption>
                        <meta itemprop="name" content="Ervin Pangilinan Professional Portrait" />
                        <meta itemprop="description" content="Professional headshot of Ervin Pangilinan, Full Stack Developer and Computer Science graduate" />
                        <meta itemprop="contentUrl" content={introImage.src} />
                        <meta itemprop="thumbnailUrl" content={introImage.src} />
                        <meta itemprop="author" content="Ervin Pangilinan" />
                        <meta itemprop="copyrightHolder" content="Ervin Pangilinan" />
                </figure>
        </aside>

        <div class="introduction-content">
                <p class="introduction-description" itemprop="description">
                        I started writing code in 2021. Today I ship full-stack web platforms for Cosmic Society, with prior production work at HEQS Group and FiveTwenty IT Services and a Computer Science degree from Cavite State University.
                </p>
                <p class="introduction-description-secondary">
                        I work across the stack but lean toward backend depth — REST APIs, role-based access, audit logging, query optimization, CI/CD. I care about clean architecture, accessibility, and code the next person can read.
                </p>

                <section class="introduction-skills" aria-labelledby="skills-heading">
                        <h3 id="skills-heading">What I build</h3>
                        <ul class="skills-list" role="list">
                                <li itemprop="knowsAbout">
                                        <SkillCard
                                                title="Web platforms"
                                                content="Production apps in TypeScript, Next.js, NestJS. Server-rendered, SPA, or hybrid."
                                                icon={webIcon}
                                        />
                                </li>
                                <li itemprop="knowsAbout">
                                        <SkillCard
                                                title="Mobile apps"
                                                content="Cross-platform with React Native + Expo. Offline-first, secure releases."
                                                icon={mobileIcon}
                                        />
                                </li>
                                <li itemprop="knowsAbout">
                                        <SkillCard
                                                title="DevOps & deploys"
                                                content="CI/CD pipelines, Docker containers, cloud hosting on Vercel, AWS, DigitalOcean, Heroku."
                                                icon={devOpsIcon}
                                        />
                                </li>
                                <li itemprop="knowsAbout">
                                        <SkillCard
                                                title="Game dev"
                                                content="Small 2D Unity prototypes when I want to think about something different."
                                                icon={gameIcon}
                                        />
                                </li>
                        </ul>
                </section>

                <aside class="learning-strip" aria-label="Currently learning">
                        <p class="learning-label">
                                <span aria-hidden="true">//</span> Currently learning
                        </p>
                        <ul class="learning-list">
                                <li>Rust</li>
                                <li><span aria-hidden="true">·</span> Server Actions in Next 16</li>
                                <li><span aria-hidden="true">·</span> LLM workflow design</li>
                        </ul>
                </aside>
        </div>
</section>
```

- [ ] **Step 5.2: Update styles**

Replace the entire `<style>` block in `Introduction.astro` with:

```css
<style>
        .introduction-main-container {
                display: grid;
                grid-template-columns: 1fr;
                justify-items: center;
                width: 100%;
                margin-top: 8vh;
                padding-inline: 24px;
                gap: 24px;

                @media (min-width: 768px) {
                        max-width: 768px;
                        padding-inline: 32px;
                }

                @media (min-width: 1024px) {
                        max-width: 1100px;
                        width: 90vw;
                        grid-template-columns: minmax(280px, 380px) 1fr;
                        grid-template-areas:
                                "head head"
                                "image content";
                        column-gap: 3rem;
                        row-gap: 1.5rem;
                        align-items: start;
                }
        }

        .section-head {
                grid-area: head;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
        }

        .introduction-title {
                width: 100%;
                text-align: left;
                font-size: clamp(2.4rem, 4.4vw, 3.4rem);
                margin: 0;
                letter-spacing: -0.02em;
        }

        .introduction-image-container {
                grid-area: image;
                position: relative;
                width: 100%;
                max-width: 380px;
                margin: 0 auto;

                @media (min-width: 1024px) {
                        margin: 0;
                }
        }

        .introduction-image {
                position: relative;
                padding: 14px 14px 8px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: 12px;
                margin: 0;
        }

        .intro-portrait {
                width: 100%;
                height: auto;
                border-radius: 8px;
                display: block;
                transition: transform 0.3s ease-in-out;
        }

        .introduction-image:hover {
                box-shadow: 0 4px 12px var(--color-shadow);
        }

        .introduction-image:hover .intro-portrait {
                transform: scale(1.01);
        }

        .portrait-caption {
                margin: 10px 4px 0;
                font-family: var(--font-mono);
                font-size: 0.72rem;
                letter-spacing: 0.04em;
                color: var(--color-text-muted);
                line-height: 1;
        }

        .introduction-content {
                grid-area: content;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 1.25rem;
                width: 100%;
        }

        .introduction-description {
                font-size: 1.05rem;
                line-height: 1.7;
                font-weight: 400;
                color: var(--color-text-secondary);
                letter-spacing: 0.2px;
                margin: 0;

                &::first-letter {
                        float: left;
                        font-size: 3.2rem;
                        line-height: 0.9;
                        font-weight: 700;
                        margin: 4px 8px 0 0;
                        font-family: 'Outfit Variable', sans-serif;
                        color: var(--color-text-primary);
                }
        }

        .introduction-description-secondary {
                font-size: 1rem;
                line-height: 1.7;
                font-weight: 400;
                color: var(--color-text-secondary);
                letter-spacing: 0.2px;
                margin: 0;
        }

        .introduction-skills {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem;
                width: 100%;
                margin-top: 1rem;
        }

        .introduction-skills > h3 {
                width: 100%;
                margin: 0 0 0.25rem;
                font-size: clamp(1.4rem, 2.4vw, 1.8rem);
                line-height: 1.2;
                letter-spacing: -0.01em;
        }

        .skills-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: contents;
        }

        @media (min-width: 640px) {
                .introduction-skills {
                        grid-template-columns: repeat(2, 1fr);
                }
                .introduction-skills > h3 {
                        grid-column: 1 / -1;
                }
        }

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
</style>
```

- [ ] **Step 5.3: Update GSAP script for new selectors**

In the `<script>` block at the bottom of `Introduction.astro`, locate the `targets = container.querySelectorAll(...)` line and replace with:

```typescript
                const targets = container.querySelectorAll(
                        ".section-head, .introduction-image, .introduction-description, .introduction-description-secondary, .introduction-skills, .learning-strip"
                );
```

(Replaces the old `.introduction-title` selector with `.section-head`, adds the new `.introduction-description-secondary` and `.learning-strip` targets.)

- [ ] **Step 5.4: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 5.5: Visual verify**

Navigate to `http://localhost:4321/#introduction` (or scroll to it). Expected:
- `01 / About` mono label above the section heading "About"
- Desktop: portrait on the LEFT, content on the right (reversed from before)
- Portrait card has a small `// Manila, PH · 2026` mono caption below
- First paragraph has a drop-cap on "I"
- Second paragraph follows
- "What I build" section with 4 sharper cards
- Below cards: `// Currently learning  Rust · Server Actions in Next 16 · LLM workflow design`
- Mobile: portrait above content, single column

- [ ] **Step 5.6: Commit**

```powershell
git add src/components/introduction/Introduction.astro
git commit -m "feat(about): add section label, reverse layout, tighten copy, add Currently learning strip"
```

---

## Task 6: Restructure experiences data + Experience component

Changes the `ExperienceItem` interface (replaces `description` with `summary` + `highlights`), adds the new Cosmic Society entry, sets HEQS end date, restructures content for the new outcome-bullet rendering. Updates the component to render summary + highlights, swap dot markers for numbered markers, replace dark `Now` pill with mono `// NOW`, and add the section label.

**Files:**
- Modify: `src/data/experiences.ts`
- Modify: `src/components/experience/Experience.astro`

- [ ] **Step 6.1: Replace experiences data file**

Overwrite `src/data/experiences.ts`:

```typescript
export interface ExperienceItem {
        role: string;
        company: string;
        period: string;
        location: string;
        summary: string;
        highlights: string[];
        tech?: string[];
}

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
                tech: [
                        "Next.js",
                        "Supabase",
                        "TypeScript",
                        "GitHub Actions",
                        "Netlify",
                        "Claude",
                ],
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
                tech: [
                        "TypeScript",
                        "Next.js",
                        "NestJS",
                        "Vercel",
                        "AWS",
                        "Heroku",
                        "GitHub Actions",
                ],
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
                tech: [
                        "Express",
                        "React",
                        "TypeScript",
                        "Prisma",
                        "PostgreSQL",
                        "DigitalOcean",
                        "Jest",
                        "Docker",
                ],
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
                tech: [
                        "React",
                        "Node.js",
                        "Express",
                        "MongoDB",
                        "C#",
                        "Unity",
                        "Python",
                        "FastAPI",
                        "spaCy",
                ],
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

- [ ] **Step 6.2: Update Experience component markup**

In `src/components/experience/Experience.astro`, replace the entire frontmatter block (`---` to `---`, lines 1–4) with:

```astro
---
import Border from "../_common/Border.astro";
import SectionLabel from "../_common/SectionLabel.astro";
import { experiences } from "../../data/experiences";

const pad2 = (n: number) => String(n + 1).padStart(2, "0");
---
```

Then replace the entire section markup (between the closing `---` of frontmatter and the `<style>` opener) with:

```astro
<section
        id="experience"
        class="experience-section"
        aria-labelledby="experience-title"
        itemscope
        itemtype="https://schema.org/Person"
>
        <Border />
        <div class="section-head">
                <SectionLabel number="02" label="Experience" />
                <h2 id="experience-title" class="section-title">
                        Experience
                </h2>
        </div>

        <div class="timeline" role="list">
                {
                        experiences.map((item, i) => {
                                const isCurrent = item.period.includes("Present");
                                return (
                                        <div
                                                class={`timeline-item ${isCurrent ? "timeline-item--current" : ""}`}
                                                data-index={i}
                                        >
                                                <span class="marker" aria-hidden="true">{pad2(i)}</span>
                                                <article
                                                        class="card"
                                                        aria-labelledby={`exp-${i}-role`}
                                                        itemscope
                                                        itemtype="https://schema.org/WorkExperience"
                                                >
                                                        <div class="card-period">
                                                                <time itemprop="startDate">{item.period}</time>
                                                                {isCurrent && (
                                                                        <span class="now-badge" aria-label="Current role">
                                                                                <span aria-hidden="true">//</span> NOW
                                                                        </span>
                                                                )}
                                                        </div>
                                                        <header class="card-head">
                                                                <h3
                                                                        id={`exp-${i}-role`}
                                                                        class="role"
                                                                        itemprop="jobTitle"
                                                                >
                                                                        {item.role}
                                                                </h3>
                                                                <p class="meta">
                                                                        <span
                                                                                class="company"
                                                                                itemprop="worksFor"
                                                                                itemscope
                                                                                itemtype="https://schema.org/Organization"
                                                                        >
                                                                                <span itemprop="name">{item.company}</span>
                                                                        </span>
                                                                        <span class="location">{item.location}</span>
                                                                </p>
                                                        </header>
                                                        <p class="summary" itemprop="description">
                                                                {item.summary}
                                                        </p>
                                                        {item.highlights.length > 0 && (
                                                                <ul class="highlights" role="list">
                                                                        {item.highlights.map((h) => (
                                                                                <li>
                                                                                        <span class="hl-glyph" aria-hidden="true">→</span>
                                                                                        <span>{h}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        )}
                                                        {item.tech && (
                                                                <div class="tech" aria-label="Technologies used">
                                                                        {item.tech.map((cur) => (
                                                                                <span>{cur}</span>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </article>
                                        </div>
                                );
                        })
                }
        </div>
</section>
```

- [ ] **Step 6.3: Update Experience component styles**

In the `<style>` block, locate the contiguous group of rules starting with `.timeline-item .marker` and ending with `.current-badge` (this group includes `.timeline-item .marker`, `.timeline-item--current .marker`, `.timeline-item--current .marker::after`, the `@keyframes marker-pulse` block, and `.current-badge`). Replace that entire group with:

```css
        /* Numbered markers — hollow pill for past, filled for current */
        .timeline-item .marker {
                position: absolute;
                top: 1.05rem;
                left: -2.5rem;
                font-family: var(--font-mono);
                font-size: 0.65rem;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: var(--color-text-muted);
                background: var(--color-background);
                border: 1px solid var(--color-border);
                padding: 0.18rem 0.4rem;
                border-radius: 4px;
                z-index: 1;
                line-height: 1;
        }

        .timeline-item--current .marker {
                color: var(--color-background);
                background: var(--color-text-primary);
                border-color: var(--color-text-primary);
                font-weight: 600;
        }

        /* // NOW mono badge replaces the old dark pill */
        .now-badge {
                font-family: var(--font-mono);
                font-size: 0.65rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                color: var(--color-text-primary);
                padding: 0.2rem 0.5rem;
                border: 1px solid var(--color-text-primary);
                border-radius: 3px;
                line-height: 1.4;
                text-transform: uppercase;
        }
```

Also locate the `.description` rule and replace it with the new `.summary` + `.highlights` rules:

```css
        .summary {
                margin: 0;
                font-size: 1rem;
                line-height: 1.65;
                color: var(--color-text-secondary);
                letter-spacing: 0.2px;
        }

        .highlights {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 0.45rem;
        }

        .highlights li {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 0.65rem;
                font-size: 0.95rem;
                line-height: 1.55;
                color: var(--color-text-secondary);
        }

        .hl-glyph {
                color: var(--color-text-muted);
                font-family: var(--font-mono);
                line-height: 1.55;
        }
```

Then locate the existing `@media (max-width: 850px)` block (which currently sets `.timeline { padding-left: 1.5rem }`, `.timeline::before { left: 0.35rem }`, `.timeline-item .marker { left: -1.15rem }`) and replace its body with the following — adjusts both the timeline padding and the marker offset to give the new pill-shaped markers room:

```css
        @media (max-width: 850px) {
                .timeline {
                        padding-left: 2rem;
                }
                .timeline::before {
                        left: 0.5rem;
                }
                .timeline-item .marker {
                        left: -1.95rem;
                }
        }
```

Finally, locate the `@media (prefers-reduced-motion: reduce)` block and remove the `.timeline-item--current .marker::after` references (those rules no longer exist):

```css
        @media (prefers-reduced-motion: reduce) {
                .timeline-item .card {
                        transition: none;
                }
                .timeline-item .card:hover {
                        transform: none;
                }
        }
```

- [ ] **Step 6.4: Update GSAP script for the new selectors**

In the `<script>` block at the bottom of `Experience.astro`, the `markers` selector should still work (still `.timeline-item .marker`), but the marker is now a `<span>` not a `<div>`, and there's no `::after` pulse. The existing GSAP code is fine — no changes required here. Verify that the selectors `.section-title` and `.timeline-item .card` and `.timeline-item .marker` all still exist in the markup after Step 6.2.

- [ ] **Step 6.5: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 6.6: Visual verify**

Navigate to `http://localhost:4321/#experience`. Expected:
- `02 / Experience` mono section label above the heading "Experience"
- 6 timeline items (Cosmic Society first, with `// NOW` mono badge)
- Numbered markers (`01`, `02`, `03`, `04`, `05`, `06`) at the left edge of each card
- Each card shows: period (mono), role (large), company · location (mono meta), summary paragraph, then arrow-glyph highlight bullets, then tech chips
- Cosmic Society and HEQS show 3 highlights each; FiveTwenty shows 3; Freelance shows 2; Student shows 1; "Getting Started" shows zero highlights (just summary)

- [ ] **Step 6.7: Commit**

```powershell
git add src/data/experiences.ts src/components/experience/Experience.astro
git commit -m "feat(experience): add Cosmic Society role, restructure to summary+highlights, numbered markers, // NOW badge"
```

---

## Task 7: Replace Stack with tiered view

Replaces the 6-card grid with a 4-tier (`// CORE / OFTEN / SOMETIMES / TOOLS`) view. New data shape, new component layout. Pills get weight differentiation by tier.

**Files:**
- Modify: `src/data/technologies.ts`
- Modify: `src/components/technology/Technology.astro`

- [ ] **Step 7.1: Replace technologies data file**

Overwrite `src/data/technologies.ts`:

```typescript
export interface SkillTier {
        label: string;       // CORE, OFTEN, SOMETIMES, TOOLS
        context: string;     // "daily", "regular reach", "shipped at least once", "daily workflow"
        skills: string[];
}

export const skillTiers: SkillTier[] = [
        {
                label: "CORE",
                context: "daily",
                skills: [
                        "TypeScript",
                        "Next.js",
                        "React",
                        "Node.js",
                        "Express",
                        "PostgreSQL",
                        "Prisma",
                        "Docker",
                ],
        },
        {
                label: "OFTEN",
                context: "regular reach",
                skills: [
                        "NestJS",
                        "React Native",
                        "Expo",
                        "Tailwind",
                        "GitHub Actions",
                        "Vercel",
                        "AWS",
                        "Supabase",
                ],
        },
        {
                label: "SOMETIMES",
                context: "shipped at least once",
                skills: [
                        "Laravel",
                        "FastAPI",
                        "Python",
                        "MongoDB",
                        "MySQL",
                        "Firebase",
                        "C#",
                        "Unity",
                ],
        },
        {
                label: "TOOLS",
                context: "daily workflow",
                skills: [
                        "Git",
                        "Figma",
                        "Postman",
                        "Draw.io",
                        "n8n",
                        "Ollama",
                        "OpenAI API",
                        "Claude",
                ],
        },
];

// Flat list retained for SEO structured data and any other consumers.
export interface Skill {
        label: string;
}

export const allSkills: Skill[] = skillTiers.flatMap((t) =>
        t.skills.map((label) => ({ label }))
);
```

- [ ] **Step 7.2: Rewrite the Technology component**

Overwrite `src/components/technology/Technology.astro`:

```astro
---
import SectionLabel from "../_common/SectionLabel.astro";
import { skillTiers } from "../../data/technologies";

const tierClass = (label: string) => `tier tier--${label.toLowerCase()}`;
---

<section
        id="tech"
        class="tech-section"
        aria-labelledby="tech-title"
        itemscope
        itemtype="https://schema.org/ItemList"
>
        <div class="section-head">
                <SectionLabel number="03" label="Stack" />
                <h2 id="tech-title" class="tech-title">Stack</h2>
                <p class="tech-intro">
                        What I reach for, in rough order of frequency.
                </p>
        </div>

        <div class="tiers">
                {
                        skillTiers.map((tier, ti) => (
                                <div class={tierClass(tier.label)} data-index={ti}>
                                        <p class="tier-label">
                                                <span class="tier-mark" aria-hidden="true">//</span>
                                                <span class="tier-name">{tier.label}</span>
                                                <span class="tier-sep" aria-hidden="true">—</span>
                                                <span class="tier-context">{tier.context}</span>
                                        </p>
                                        <ul class="pills" role="list">
                                                {tier.skills.map((skill, si) => (
                                                        <li
                                                                class="pill"
                                                                itemprop="itemListElement"
                                                                itemscope
                                                                itemtype="https://schema.org/Thing"
                                                        >
                                                                <meta itemprop="position" content={String(ti * 10 + si + 1)} />
                                                                <span itemprop="name">{skill}</span>
                                                        </li>
                                                ))}
                                        </ul>
                                </div>
                        ))
                }
        </div>
</section>

<style>
        .tech-section {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2rem;
                padding: clamp(2rem, 5vw, 3rem) 1rem clamp(2.5rem, 6vw, 3.5rem);
                margin-top: 4vh;
        }

        .section-head {
                width: min(880px, 90%);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.6rem;
        }

        .tech-title {
                font-size: clamp(2.4rem, 4.5vw, 3.4rem);
                margin: 0;
                letter-spacing: -0.02em;
                font-weight: 600;
        }

        .tech-intro {
                margin: 0;
                font-family: var(--font-mono);
                font-size: 0.85rem;
                color: var(--color-text-muted);
                letter-spacing: 0.02em;
        }

        .tiers {
                width: min(880px, 90%);
                display: flex;
                flex-direction: column;
                gap: 1.6rem;
        }

        .tier {
                display: flex;
                flex-direction: column;
                gap: 0.7rem;
        }

        .tier-label {
                font-family: var(--font-mono);
                font-size: 0.78rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                color: var(--color-text-primary);
                margin: 0;
                line-height: 1;
                display: inline-flex;
                align-items: baseline;
                gap: 0.45rem;
        }

        .tier-mark {
                color: var(--color-text-secondary);
                opacity: 0.7;
                font-weight: 500;
        }

        .tier-name {
                color: var(--color-text-primary);
        }

        .tier-sep {
                color: var(--color-text-muted);
                opacity: 0.6;
                font-weight: 400;
        }

        .tier-context {
                color: var(--color-text-muted);
                font-weight: 400;
                text-transform: lowercase;
        }

        .pills {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
        }

        .pill {
                font-family: var(--font-mono);
                font-size: 0.78rem;
                font-weight: 400;
                padding: 0.35rem 0.65rem;
                background: var(--color-surface-alt);
                border-radius: 4px;
                color: var(--color-text-secondary);
                letter-spacing: 0.02em;
                cursor: default;
                transition: color 0.2s ease, background-color 0.2s ease;
        }

        /* Weight differentiation by tier */
        .tier--core .pill {
                color: var(--color-text-primary);
                font-weight: 500;
                font-size: 0.82rem;
                padding: 0.4rem 0.7rem;
        }

        .tier--often .pill {
                color: var(--color-text-secondary);
        }

        .tier--sometimes .pill {
                color: var(--color-text-muted);
        }

        .tier--tools .pill {
                color: var(--color-text-muted);
                font-size: 0.75rem;
                padding: 0.3rem 0.55rem;
        }

        @media (hover: hover) {
                .pill:hover {
                        color: var(--color-text-primary);
                        background: var(--color-surface-muted);
                }
        }
</style>

<script>
        import { gsap } from "gsap";
        import { ScrollTrigger } from "gsap/ScrollTrigger";

        if (typeof window !== "undefined") {
                const prefersReduced = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                ).matches;

                if (!prefersReduced) {
                        gsap.registerPlugin(ScrollTrigger);

                        const init = () => {
                                const section = document.querySelector("#tech");
                                if (!section) return;

                                const head = section.querySelector(".section-head");
                                if (head) {
                                        gsap.fromTo(
                                                head,
                                                { filter: "blur(6px)", opacity: 0, y: 16 },
                                                {
                                                        filter: "blur(0px)",
                                                        opacity: 1,
                                                        y: 0,
                                                        duration: 0.6,
                                                        ease: "power2.out",
                                                        scrollTrigger: {
                                                                trigger: head,
                                                                start: "top 90%",
                                                                end: "top 60%",
                                                                scrub: true,
                                                        },
                                                }
                                        );
                                }

                                const tiers = section.querySelectorAll(".tier");
                                tiers.forEach((tier) => {
                                        gsap.fromTo(
                                                tier,
                                                { filter: "blur(8px)", opacity: 0, y: 18 },
                                                {
                                                        filter: "blur(0px)",
                                                        opacity: 1,
                                                        y: 0,
                                                        duration: 0.6,
                                                        ease: "power2.out",
                                                        scrollTrigger: {
                                                                trigger: tier,
                                                                start: "top 92%",
                                                                end: "top 70%",
                                                                scrub: true,
                                                        },
                                                }
                                        );
                                });
                        };

                        requestAnimationFrame(() => {
                                init();
                                window.addEventListener("load", () => ScrollTrigger.refresh());
                        });
                }
        }
</script>
```

- [ ] **Step 7.3: Verify build**

```powershell
npm run build
```
Expected: success. If you see "Cannot find name 'skillGroups'", search the project for any other file that imports `skillGroups` and update them — but per the spec, only `Technology.astro` was using it.

```powershell
# Defensive search — should return zero matches
Select-String -Path "E:\other\portfolio\src\**\*.astro","E:\other\portfolio\src\**\*.ts","E:\other\portfolio\src\**\*.tsx" -Pattern "skillGroups"
```
Expected: no matches.

- [ ] **Step 7.4: Visual verify**

Navigate to `http://localhost:4321/#tech`. Expected:
- `03 / Stack` mono label above the heading "Stack"
- One-line mono intro: "What I reach for, in rough order of frequency."
- Four rows below:
  - `// CORE — daily` followed by 8 pills, slightly larger and primary text color
  - `// OFTEN — regular reach` followed by 8 pills, secondary text color
  - `// SOMETIMES — shipped at least once` followed by 8 pills, muted text color
  - `// TOOLS — daily workflow` followed by 8 pills, smaller and muted

- [ ] **Step 7.5: Commit**

```powershell
git add src/data/technologies.ts src/components/technology/Technology.astro
git commit -m "feat(stack): replace 6-card grid with tiered // CORE / OFTEN / SOMETIMES / TOOLS view"
```

---

## Task 8: Add featured project + role/impact lines

Adds optional `role` and `impact` fields to `ProjectItem`, fills them in for existing projects, adds a `featured` variant to `ProjectCard.astro` with image-left layout, and updates `Projects.astro` to render the first project as featured + the section label + tightened intro + H2 instead of H1.

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/components/projects/ProjectCard.astro`
- Modify: `src/components/projects/Projects.astro`

- [ ] **Step 8.1: Update projects data**

Overwrite `src/data/projects.ts`:

```typescript
import DemoImageInventory from "../assets/projects/inventory.png";
import timekeeping from "../assets/projects/timekeeping.png";
import greenCycle from "../assets/projects/greenCycle.png";
import fairWrite from "../assets/projects/fairwrite.png";

export interface ProjectItem {
        title: string;
        description: string;
        stack: string[];
        role?: string;
        impact?: string;
        repo?: string;
        demo?: string;
        year?: string;
        image?: ImageMetadata;
        imageAlt?: string;
}

export const projects: ProjectItem[] = [
        {
                title: "Paysera Timekeeping System",
                role: "Backend lead — RBAC, audit logging, API design, performance tuning",
                impact: "Used daily by FiveTwenty's enterprise clients in production",
                description:
                        "Internship at FiveTwenty: our team built a timekeeping platform. I mainly contributed to the backend, including role-based access control, audit logging, API design, performance tuning, and automated tests.",
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
                role: "Backend + NLP — REST APIs, real-time bias-detection pipelines",
                impact: "Group thesis project; live demo serving real users",
                description:
                        "Group thesis project: my role involved backend and NLP development, where I built REST APIs and integrated pipelines to detect biased terms and suggest inclusive alternatives in real time.",
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
                role: "Solo developer — full stack",
                description:
                        "Freelance project developed a sales and inventory management system for selling Japanese sweets.",
                stack: ["React", "Node.js", "Express", "MySQL"],
                year: "2023",
                repo: "https://github.com/pangilinanervin22/inventory_react",
                demo: "https://pangilinanervin22.github.io/inventory_react/",
                image: DemoImageInventory,
                imageAlt: "image of ajapco sales and inventory system",
        },
        {
                title: "GreenCycle Mobile App",
                role: "Solo developer — backend, offline sync, cross-platform testing",
                impact: "Tested data sync between cloud and local storage on Android and iOS",
                description:
                        "Freelance project — built online-first backend logic with offline support for a recycling app and tested data sync between cloud and local storage across Android/iOS.",
                stack: ["React Native", "Expo", "Supabase", "TypeScript"],
                year: "2025",
                repo: "https://github.com/pangilinanervin22/GreenCycle",
                image: greenCycle,
                imageAlt: "image of greencycle a recycling mobile app",
        },
];
```

- [ ] **Step 8.2: Update ProjectCard component**

Overwrite `src/components/projects/ProjectCard.astro`:

```astro
---
import type { ProjectItem } from "../../data/projects";
import GithubIcon from "../../assets/icons/github.svg";
import LinkIcon from "../../assets/icons/link.svg";

interface Props {
        project: ProjectItem;
        index: number;
        featured?: boolean;
}
const { project: p, index: i, featured = false } = Astro.props as Props;
---

<li
        class={`project-card${featured ? " project-card--featured" : ""}`}
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/CreativeWork"
>
        <article class="card" aria-labelledby={`proj-${i}-title`}>
                {p.image && (
                        <figure class="media" itemprop="image">
                                <img
                                        src={p.image.src}
                                        width={p.image.width}
                                        height={p.image.height}
                                        alt={p.imageAlt || `${p.title} - screenshot showcasing the ${p.stack.join(', ')} stack`}
                                        loading="lazy"
                                        decoding="async"
                                        itemprop="image"
                                        itemscope
                                        itemtype="https://schema.org/ImageObject"
                                />
                                <figcaption class="visually-hidden">
                                        {p.imageAlt || p.title}
                                </figcaption>
                        </figure>
                )}
                <div class="body">
                        <header class="card-head">
                                {featured && (
                                        <p class="featured-label" aria-label="Featured project">
                                                <span aria-hidden="true">//</span> FEATURED
                                        </p>
                                )}
                                <div class="title-row">
                                        <h3
                                                id={`proj-${i}-title`}
                                                class="card-title"
                                                itemprop="headline"
                                        >
                                                {p.title}
                                        </h3>
                                        {p.year && (
                                                <span class="year" aria-label="Year">
                                                        {p.year}
                                                </span>
                                        )}
                                </div>
                        </header>

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

                        <p class="card-desc" itemprop="description">{p.description}</p>

                        <ul class="stack" role="list" aria-label="Tech stack">
                                {p.stack.map((t) => (
                                        <li class="badge" itemprop="keywords">
                                                {t}
                                        </li>
                                ))}
                        </ul>

                        {(p.demo || p.repo) && (
                                <nav class="links" aria-label="Project links">
                                        {p.demo && (
                                                <a
                                                        class="link"
                                                        href={p.demo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        itemprop="url"
                                                        aria-label={`Open live site for ${p.title}`}
                                                >
                                                        <LinkIcon class="icon" aria-hidden="true" />
                                                        <span>Live</span>
                                                        <span class="link-arrow" aria-hidden="true">→</span>
                                                </a>
                                        )}
                                        {p.repo && (
                                                <a
                                                        class="link"
                                                        href={p.repo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        itemprop="codeRepository"
                                                        aria-label={`Open GitHub repo for ${p.title}`}
                                                >
                                                        <GithubIcon class="icon" aria-hidden="true" />
                                                        <span>GitHub</span>
                                                        <span class="link-arrow" aria-hidden="true">→</span>
                                                </a>
                                        )}
                                </nav>
                        )}
                </div>
        </article>
</li>

<style scoped lang="css">
        .project-card {
                position: relative;
        }

        .project-card--featured {
                grid-column: 1 / -1;
        }

        .card {
                position: relative;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: 12px;
                padding: 1.45rem 1.5rem 1.75rem;
                display: flex;
                flex-direction: column;
                gap: 1.05rem;
                height: 100%;
                box-shadow: 0 1px 3px var(--color-shadow-soft);
                transition:
                        transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                        border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (hover: hover) {
                .card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px var(--color-shadow);
                        border-color: var(--color-text-muted);
                }
                .card:hover .media img {
                        transform: scale(1.02);
                }
                .card:hover .link-arrow {
                        transform: translateX(2px);
                }
        }

        /* Featured layout: image left, content right on desktop */
        .project-card--featured .card {
                padding: 1.6rem;
                gap: 1.6rem;
        }

        @media (min-width: 880px) {
                .project-card--featured .card {
                        flex-direction: row;
                        align-items: stretch;
                }
                .project-card--featured .media {
                        flex: 1 1 50%;
                        max-width: 50%;
                        aspect-ratio: 16/10;
                }
                .project-card--featured .body {
                        flex: 1 1 50%;
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                }
        }

        .body {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                flex-grow: 1;
        }

        .media {
                position: relative;
                aspect-ratio: 16/9;
                width: 100%;
                margin: 0;
                overflow: hidden;
                border-radius: 8px;
                background: var(--color-surface-alt);
                border: 1px solid var(--color-border);
        }

        .media::after {
                content: "";
                position: absolute;
                inset: 0;
                background: linear-gradient(
                        to top,
                        rgba(0, 0, 0, 0.18) 0%,
                        transparent 50%
                );
                border-radius: 8px;
                opacity: 0;
                transition: opacity 0.35s ease;
                pointer-events: none;
        }

        @media (hover: hover) {
                .card:hover .media::after {
                        opacity: 1;
                }
        }

        .media img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                transition: transform 0.5s ease;
        }

        .visually-hidden {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0 0 0 0);
                white-space: nowrap;
                border: 0;
        }

        .card-head {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
        }

        .featured-label {
                font-family: var(--font-mono);
                font-size: 0.7rem;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: var(--color-text-muted);
                margin: 0;
                line-height: 1;
                text-transform: uppercase;
        }

        .title-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.75rem;
                flex-wrap: wrap;
        }

        .card-title {
                margin: 0;
                font-size: 1.4rem;
                line-height: 1.25;
                font-weight: 700;
                letter-spacing: -0.01em;
        }

        .project-card--featured .card-title {
                font-size: clamp(1.5rem, 2.5vw, 1.85rem);
        }

        .year {
                font-family: var(--font-mono);
                font-size: 0.72rem;
                letter-spacing: 0.02em;
                padding: 0.3rem 0.55rem;
                border-radius: 4px;
                color: var(--color-text-muted);
                background: var(--color-surface-alt);
                white-space: nowrap;
        }

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

        .card-desc {
                margin: 0;
                font-size: 1rem;
                line-height: 1.65;
                color: var(--color-text-secondary);
                flex-grow: 1;
        }

        .stack {
                list-style: none;
                display: flex;
                flex-wrap: wrap;
                gap: 0.45rem;
                margin: 0;
                padding: 0;
        }

        .badge {
                font-family: var(--font-mono);
                font-size: 0.72rem;
                letter-spacing: 0.02em;
                font-weight: 400;
                padding: 0.35rem 0.65rem;
                border-radius: 4px;
                background: var(--color-surface-alt);
                color: var(--color-text-muted);
        }

        .links {
                display: flex;
                gap: 0.85rem;
                margin-top: 0.25rem;
        }

        .link {
                position: relative;
                font-family: var(--font-mono);
                font-size: 0.75rem;
                letter-spacing: 0.02em;
                font-weight: 500;
                text-transform: uppercase;
                padding: 0.5rem 0.8rem;
                border: 1px solid var(--color-border);
                border-radius: 6px;
                background: var(--color-surface-alt);
                color: var(--color-text-primary);
                text-decoration: none;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                display: inline-flex;
                align-items: center;
                gap: 0.45rem;
        }

        .icon {
                width: 1rem;
                height: 1rem;
                display: block;
        }

        .link-arrow {
                display: inline-block;
                transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (hover: hover) {
                .link:hover {
                        background: var(--color-accent);
                        border-color: var(--color-accent);
                        color: var(--color-text-inverse);
                }
        }

        @media (prefers-reduced-motion: reduce) {
                .card,
                .link,
                .media img,
                .link-arrow {
                        transition: none;
                }
        }
</style>
```

- [ ] **Step 8.3: Update Projects.astro to render featured-first**

Overwrite `src/components/projects/Projects.astro`:

```astro
---
import ProjectCard from "./ProjectCard.astro";
import SectionLabel from "../_common/SectionLabel.astro";
import { projects } from "../../data/projects";

const [featured, ...rest] = projects;
---

<section
        id="projects"
        class="projects-section"
        aria-labelledby="projects-title"
        itemtype="https://schema.org/ItemList"
        itemscope
>
        <div class="section-head">
                <SectionLabel number="04" label="Work" />
                <h2 id="projects-title" class="section-title" itemprop="name">
                        Work
                </h2>
                <p class="section-intro">
                        Selected work from internship, freelance, and academic projects. Each shipped to real users.
                </p>
        </div>

        <ul class="projects-grid" role="list">
                {featured && <ProjectCard project={featured} index={0} featured />}
                {rest.map((p, i) => <ProjectCard project={p} index={i + 1} />)}
        </ul>
</section>

<style>
        .projects-section {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 4rem 1.25rem 5rem;
                gap: 2rem;
                margin-top: 6vh;
        }

        .section-head {
                width: min(1500px, 90%);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.6rem;
        }

        .section-title {
                font-size: clamp(2.4rem, 4.5vw, 3.4rem);
                letter-spacing: -0.02em;
                font-weight: 600;
                margin: 0;
        }

        .section-intro {
                max-width: 64ch;
                font-size: 1rem;
                line-height: 1.65;
                margin: 0;
                color: var(--color-text-secondary);
        }

        .projects-grid {
                --min: clamp(320px, 40vw, 540px);
                --gap: 1.6rem;
                list-style: none;
                padding: 0;
                margin: 0;
                width: min(1500px, 90%);
                display: grid;
                grid-template-columns: repeat(
                        auto-fill,
                        minmax(var(--min), 1fr)
                );
                gap: var(--gap);
                align-items: stretch;
        }

        @media (prefers-reduced-motion: reduce) {
                .projects-grid {
                        animation: none;
                }
        }
</style>

<script>
        import { gsap } from "gsap";
        import { ScrollTrigger } from "gsap/ScrollTrigger";

        if (typeof window !== "undefined") {
                const prefersReduced = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                ).matches;

                if (!prefersReduced) {
                        gsap.registerPlugin(ScrollTrigger);

                        const init = () => {
                                const section = document.querySelector("#projects");
                                if (!section) return;

                                const head = section.querySelector(".section-head");
                                if (head) {
                                        gsap.fromTo(
                                                head,
                                                { filter: "blur(6px)", opacity: 0, y: 14 },
                                                {
                                                        filter: "blur(0px)",
                                                        opacity: 1,
                                                        y: 0,
                                                        duration: 0.6,
                                                        ease: "power2.out",
                                                        scrollTrigger: {
                                                                trigger: head,
                                                                start: "top 70%",
                                                                end: "top 20%",
                                                                scrub: true,
                                                        },
                                                }
                                        );
                                }

                                const cards = section.querySelectorAll(".project-card");
                                if (cards.length) {
                                        ScrollTrigger.batch(cards, {
                                                start: "top 90%",
                                                end: "top 60%",
                                                once: true,
                                                onEnter: (batch) => {
                                                        gsap.fromTo(
                                                                batch,
                                                                {
                                                                        opacity: 0,
                                                                        y: 24,
                                                                        filter: "blur(10px)",
                                                                },
                                                                {
                                                                        opacity: 1,
                                                                        y: 0,
                                                                        filter: "blur(0px)",
                                                                        duration: 0.5,
                                                                        ease: "power2.out",
                                                                        stagger: {
                                                                                each: 0.12,
                                                                                from: "start",
                                                                        },
                                                                }
                                                        );
                                                },
                                        });
                                }
                        };

                        requestAnimationFrame(() => {
                                init();
                                window.addEventListener("load", () => ScrollTrigger.refresh());
                        });
                }
        }
</script>
```

- [ ] **Step 8.4: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 8.5: Visual verify**

Navigate to `http://localhost:4321/#projects`. Expected:
- `04 / Work` mono section label above the heading "Work"
- Tightened intro sentence
- First card (Paysera Timekeeping) spans full grid width:
  - Desktop ≥ 880px: image on left ~50%, content (with `// FEATURED` label, title, `// MY ROLE` and `// IMPACT` meta lines, description, stack chips, links if any) on right
  - Below 880px: stacks vertically
- Three remaining project cards (Fair Write, Ajapco, GreenCycle) in 2-col grid below
- Each non-featured card shows `// MY ROLE` (and `// IMPACT` where present) above description
- Hover on a Live/GitHub link: `→` slides 2px right; background fills monochrome accent

- [ ] **Step 8.6: Commit**

```powershell
git add src/data/projects.ts src/components/projects/ProjectCard.astro src/components/projects/Projects.astro
git commit -m "feat(work): add featured-project layout, // MY ROLE / // IMPACT meta lines, section label"
```

---

## Task 9: Add footer CTA block + tighten copy

Adds the centered "Open to opportunities" CTA block above the existing 4-column grid. Tightens copy in the grid below (tagline, capitalization, mono headings).

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 9.1: Update markup**

Open `src/components/Footer.astro`. Replace the entire `<footer>...</footer>` block with:

```astro
<footer id="footer" class="footer-container" aria-labelledby="footer-heading">
        <Border />
        <h2 id="footer-heading" class="visually-hidden">Site footer</h2>

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
                                aria-label="Send email"
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

        <div class="footer-inner">
                <div class="cluster primary">
                        <p class="brand">
                                &copy; {year}
                                <span class="name">Ervin Pangilinan</span>
                        </p>
                        <p class="tagline">Manila, Philippines · Building for the world.</p>
                </div>

                <nav aria-label="Footer navigation" class="mini-nav">
                        <h3 class="heading">
                                <span aria-hidden="true">//</span> NAVIGATE
                        </h3>
                        <ul class="mini-list">
                                <li><a href={`${import.meta.env.BASE_URL}#welcome`}>Home</a></li>
                                <li><a href={`${import.meta.env.BASE_URL}#introduction`}>About</a></li>
                                <li><a href={`${import.meta.env.BASE_URL}#experience`}>Experience</a></li>
                                <li><a href={`${import.meta.env.BASE_URL}#projects`}>Work</a></li>
                        </ul>
                </nav>

                <nav aria-label="Social links" class="social-nav">
                        <h3 class="heading">
                                <span aria-hidden="true">//</span> CONNECT
                        </h3>
                        <ul class="social-list">
                                <li>
                                        <a
                                                href="https://github.com/pangilinanervin22"
                                                rel="me noopener noreferrer"
                                                target="_blank">GitHub</a>
                                </li>
                                <li>
                                        <a
                                                href="mailto:pangilinanervin22@gmail.com">Email</a>
                                </li>
                                <li>
                                        <a
                                                href="https://www.linkedin.com/in/ervin-pangilinan-9b9410231"
                                                target="_blank">LinkedIn</a>
                                </li>
                        </ul>
                </nav>

                <div class="meta-block">
                        <p class="stack" aria-label="Tech stack">
                                Stack: <span>Astro</span> · <span>TypeScript</span> · <span>CSS</span>
                        </p>
                        <p class="meta">
                                Built with <a href="https://astro.build" target="_blank">Astro</a>. Updated {buildDate}.
                        </p>
                        <p class="meta small">
                                <button id="backToTopBtn" class="top-btn" type="button">Back to top ↑</button>
                        </p>
                </div>
        </div>
</footer>
```

- [ ] **Step 9.2: Append CTA block styles**

Inside the `<style>` block in `Footer.astro`, append the following before the closing `</style>` tag:

```css
        /* Top CTA block */
        .cta-block {
                width: min(720px, 92%);
                margin: 0 auto 2.5rem;
                padding: 2.75rem 1rem 2.5rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                text-align: center;
                border-bottom: 1px solid var(--color-border);
        }

        .cta-label {
                font-family: var(--font-mono);
                font-size: 0.78rem;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: var(--color-text-muted);
                margin: 0;
                line-height: 1;
        }

        .cta-headline {
                font-family: 'Outfit Variable', sans-serif;
                font-size: clamp(1.4rem, 3vw, 2.1rem);
                font-weight: 600;
                line-height: 1.25;
                letter-spacing: -0.02em;
                color: var(--color-text-primary);
                margin: 0;
                max-width: 30ch;
        }

        .cta-sub {
                font-size: 1rem;
                color: var(--color-text-secondary);
                margin: 0;
        }

        .cta-actions {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 0.85rem;
                margin-top: 0.5rem;
        }

        .cta-btn {
                display: inline-flex;
                align-items: center;
                gap: 0.45rem;
                padding: 0.7rem 1.1rem;
                font-family: var(--font-mono);
                font-size: 0.82rem;
                font-weight: 500;
                color: var(--color-text-primary);
                text-decoration: none;
                background: transparent;
                border: 1px solid var(--color-border);
                border-radius: 6px;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-btn:hover {
                border-color: var(--color-text-primary);
                transform: translateY(-1px);
        }

        .cta-btn--primary {
                background: var(--color-accent);
                color: var(--color-text-inverse);
                border-color: var(--color-accent);
        }

        .cta-btn--primary:hover {
                background: var(--color-accent-hover);
                border-color: var(--color-accent-hover);
                color: var(--color-text-inverse);
        }

        @media (max-width: 520px) {
                .cta-actions {
                        flex-direction: column;
                        width: 100%;
                }
                .cta-btn {
                        width: 100%;
                        justify-content: center;
                }
        }

        @media (prefers-reduced-motion: reduce) {
                .cta-btn {
                        transition: none;
                }
        }
```

- [ ] **Step 9.3: Verify build**

```powershell
npm run build
```
Expected: success.

- [ ] **Step 9.4: Visual verify**

Scroll to bottom of the page. Expected:
- Centered CTA block at top:
  - `// Open to opportunities` mono label
  - Headline: "Looking for a full-stack developer comfortable across the stack and shipping?"
  - "Let's talk." sub
  - Three buttons in a row: email (filled monochrome), LinkedIn (outline), Resume (outline)
- Below CTA, the existing 4-column grid:
  - Brand: `© 2026 Ervin Pangilinan` + tagline `Manila, Philippines · Building for the world.`
  - `// NAVIGATE` heading + Home / About / Experience / Work links
  - `// CONNECT` heading + GitHub / Email / LinkedIn links
  - Stack: `Astro · TypeScript · CSS` + build date + Back to top button

- [ ] **Step 9.5: Commit**

```powershell
git add src/components/Footer.astro
git commit -m "feat(footer): add Open to opportunities CTA block, tighten grid copy"
```

---

## Task 10: Final QA — build, accessibility, screenshots

Confirm everything works together end-to-end before declaring done.

- [ ] **Step 10.1: Clean rebuild**

```powershell
npm run build
```
Expected: success, no warnings.

- [ ] **Step 10.2: Type check (Astro)**

```powershell
npx astro check
```
Expected: no errors. (Warnings about unused imports may appear — clean those if any.)

- [ ] **Step 10.3: Visual screenshot pass**

Using Playwright, take full-page screenshots at three viewport sizes and verify each matches the spec section by section:

```typescript
// Desktop
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:4321/');
await page.screenshot({ path: 'qa-desktop-full.png', fullPage: true });

// Tablet
await page.setViewportSize({ width: 820, height: 1180 });
await page.screenshot({ path: 'qa-tablet-full.png', fullPage: true });

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: 'qa-mobile-full.png', fullPage: true });
```

Expected: each screenshot shows the redesigned hero, about, experience, stack, work, and footer sections as defined in the spec, with no layout breakage.

- [ ] **Step 10.4: Theme toggle check**

Click the theme toggle in the navbar. Take a screenshot in dark mode at 1440×900. Expected: all sections use dark theme tokens correctly. Pay special attention to the tier pills, CTA block buttons, mono labels, and timeline numbered markers — they should all be readable.

- [ ] **Step 10.5: Reduced motion check**

In the browser dev tools, set `prefers-reduced-motion: reduce` (Chrome: Rendering panel → Emulate CSS media). Reload. Expected:
- Hero elements appear without animation, all opaque
- Section labels and cards appear without scroll-triggered blur
- Scroll hint arrow does not bounce
- Hover transitions disabled

- [ ] **Step 10.6: Keyboard accessibility check**

From `http://localhost:4321/`, press `Tab` repeatedly. Expected:
- First tab focuses "Skip to main content" link
- Tab order: nav links → Resume button → theme toggle → hero CV button → hero text links → scroll hint
- Focus rings visible (2px outline) on every focusable element
- No tab traps; can reach all interactive elements

- [ ] **Step 10.7: Final commit (if any cleanup happened in Steps 10.1–10.6)**

If you fixed anything during QA, commit it. Otherwise skip.

```powershell
git status
# If clean: nothing to commit. If not:
git add -A
git commit -m "chore: post-QA cleanup"
```

- [ ] **Step 10.8: Summary report**

Print a short summary to the user:
- Sections changed (Hero, Nav, About, Experience, Stack, Work, Footer)
- Files added (`SectionLabel.astro`)
- New current role surfaced (Cosmic Society)
- New tier-based stack view
- New featured-project layout
- New footer CTA
- Any open follow-ups (e.g., user-supplied content for `// Currently learning`, location of Cosmic Society if not Berlin)
