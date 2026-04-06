# Monochrome Refined Portfolio Reskin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from generic minimalism into a distinctive monochrome refined aesthetic with warm surfaces, hairline borders, soft shadows, and monospace developer accents.

**Architecture:** CSS-first reskin of existing Astro components. No new components or pages. Theme variables updated first, then each section restyled. JetBrains Mono added as a monospace accent font. Technology section markup changes from badge grid to inline text list.

**Tech Stack:** Astro 5, CSS custom properties, Google Fonts (JetBrains Mono), GSAP (existing)

**Spec:** `docs/superpowers/specs/2026-04-06-monochrome-refined-reskin-design.md`

---

### Task 1: Update Light Theme Variables

**Files:**
- Modify: `src/styles/_theme.css`

- [ ] **Step 1: Update color variables**

Replace the entire contents of `src/styles/_theme.css` with:

```css
:root {
    /* Base */
    --color-background: #faf8f6;
    --color-background-alt: #f5f3f0;
    --color-surface: #ffffff;
    --color-surface-alt: #f5f3f0;
    --color-surface-muted: #eeecE9;
    --color-border: #eeeeee;

    /* Grayscale scale (monochrome depth) */
    --gray-0: #ffffff;
    --gray-50: #f7f7f7;
    --gray-100: #f0f0f0;
    --gray-200: #e0e0e0;
    --gray-300: #c8c8c8;
    --gray-400: #a3a3a3;
    --gray-500: #808080;
    --gray-600: #666666;
    --gray-700: #4d4d4d;
    --gray-750: #3d3d3d;
    --gray-800: #2b2b2b;
    --gray-850: #1d1d1d;
    --gray-900: #111111;
    --gray-950: #0a0a0a;
    --gray-1000: #000000;

    /* Primary / semantic (mapped to scale) */
    --color-primary: var(--gray-1000);
    --color-primary-80: var(--gray-850);
    --color-primary-60: var(--gray-700);
    --color-primary-40: var(--gray-500);
    --color-primary-20: var(--gray-300);
    --color-primary-10: var(--gray-200);

    --color-secondary: #2b2b2b;
    --color-secondary-alt: #3d3d3d;

    /* Text */
    --color-text-primary: #111111;
    --color-text-secondary: #555555;
    --color-text-muted: #999999;
    --color-text-faint: #bbbbbb;
    --color-text-inverse: #ffffff;

    /* Accent — black is the accent in monochrome */
    --color-accent: #111111;
    --color-accent-hover: #333333;
    --color-accent-muted: #11111130;
    --color-accent-subtle: #11111112;

    /* Links */
    --color-link: var(--color-text-primary);
    --color-link-hover: var(--color-accent-hover);
    --color-link-active: #000000;
    --color-link-visited: #222222;
    --color-link-underline: #999999;

    /* Icons */
    --color-icon: #333333;
    --color-icon-muted: #999999;
    --color-icon-inverse: #ffffff;

    /* States */
    --color-focus-ring: #111111;
    --color-outline: #111111;
    --color-selection-bg: #000000;
    --color-selection-text: #ffffff;

    /* Shadows / depth — subtler */
    --color-shadow-soft: rgba(0, 0, 0, 0.04);
    --color-shadow: rgba(0, 0, 0, 0.08);
    --color-shadow-strong: rgba(0, 0, 0, 0.12);
    --color-backdrop: rgba(0, 0, 0, 0.55);

    /* Gradients (still monochrome) */
    --gradient-soft: linear-gradient(180deg, #ffffff, #f5f3f0);
    --gradient-inset: linear-gradient(180deg, #2b2b2b, #111111);

    /* Font families */
    --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

- [ ] **Step 2: Verify dev server shows warm background**

Run: `npm run dev` (if not already running)

Open http://localhost:4321 — the page background should now be warm off-white (`#faf8f6`) instead of pure white. Cards should be white floating on the warm background.

- [ ] **Step 3: Commit**

```bash
git add src/styles/_theme.css
git commit -m "style: update light theme to monochrome refined palette"
```

---

### Task 2: Update Dark Theme Variables

**Files:**
- Modify: `src/styles/_theme_dark.css`

- [ ] **Step 1: Update dark theme variables**

Replace the entire contents of `src/styles/_theme_dark.css` with:

```css
:root[data-theme='dark'] {
    /* Grayscale scale (keep same canonical values) */
    --gray-0: #eeeeee;
    --gray-50: #f7f7f7;
    --gray-100: #f0f0f0;
    --gray-200: #e0e0e0;
    --gray-300: #c8c8c8;
    --gray-400: #a3a3a3;
    --gray-500: #808080;
    --gray-600: #666666;
    --gray-700: #4d4d4d;
    --gray-750: #3d3d3d;
    --gray-800: #2b2b2b;
    --gray-850: #1d1d1d;
    --gray-900: #111111;
    --gray-950: #0a0a0a;
    --gray-1000: #000000;

    /* Base — warm dark tones */
    --color-background: #111110;
    --color-background-alt: #1a1a18;
    --color-surface: #1c1c1a;
    --color-surface-alt: #2a2a26;
    --color-surface-muted: #333330;
    --color-border: #2a2a28;

    /* Primary / semantic (inverted vs light theme) */
    --color-primary: var(--gray-0);
    --color-primary-80: var(--gray-200);
    --color-primary-60: var(--gray-400);
    --color-primary-40: var(--gray-600);
    --color-primary-20: var(--gray-800);
    --color-primary-10: var(--gray-900);

    --color-secondary: var(--gray-800);
    --color-secondary-alt: var(--gray-750);

    /* Text */
    --color-text-primary: #eeeeee;
    --color-text-secondary: #bbbbbb;
    --color-text-muted: #777777;
    --color-text-faint: #555555;
    --color-text-inverse: var(--gray-1000);

    /* Accent — white is the accent in dark mode */
    --color-accent: #ffffff;
    --color-accent-hover: #dddddd;
    --color-accent-muted: #ffffff30;
    --color-accent-subtle: #ffffff12;

    /* Links */
    --color-link: #eeeeee;
    --color-link-hover: #dddddd;
    --color-link-active: var(--gray-0);
    --color-link-visited: var(--gray-200);
    --color-link-underline: var(--gray-500);

    /* Icons */
    --color-icon: var(--gray-300);
    --color-icon-muted: var(--gray-600);
    --color-icon-inverse: var(--gray-1000);

    /* States */
    --color-focus-ring: #ffffff;
    --color-outline: var(--gray-300);
    --color-selection-bg: var(--gray-0);
    --color-selection-text: var(--gray-1000);

    /* Shadows / depth */
    --color-shadow-soft: rgba(0, 0, 0, 0.15);
    --color-shadow: rgba(0, 0, 0, 0.25);
    --color-shadow-strong: rgba(0, 0, 0, 0.35);
    --color-backdrop: rgba(0, 0, 0, 0.70);

    /* Gradients */
    --gradient-soft: linear-gradient(180deg, #1c1c1a, #111110);
    --gradient-inset: linear-gradient(180deg, #2a2a26, #1c1c1a);
}
```

- [ ] **Step 2: Verify dark theme**

Toggle to dark mode — background should be warm near-black (`#111110`), not cold pure black. Cards should be `#1c1c1a`.

- [ ] **Step 3: Commit**

```bash
git add src/styles/_theme_dark.css
git commit -m "style: update dark theme to warm monochrome palette"
```

---

### Task 3: Add JetBrains Mono Font

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Install JetBrains Mono via fontsource**

```bash
npm install @fontsource/jetbrains-mono
```

- [ ] **Step 2: Import JetBrains Mono in Layout.astro**

In `src/layouts/Layout.astro`, add these imports after the existing Sora imports (line 8):

```astro
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
```

The full import block should now read:

```astro
import "@fontsource-variable/outfit";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
```

- [ ] **Step 3: Verify font loads**

In browser DevTools, inspect any element and confirm `JetBrains Mono` is available in the font family dropdown. The `--font-mono` variable was already added to `_theme.css` in Task 1.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro package.json package-lock.json
git commit -m "feat: add JetBrains Mono font for monospace accents"
```

---

### Task 4: Restyle Welcome Section

**Files:**
- Modify: `src/components/Welcome.astro`

- [ ] **Step 1: Update tagline to use monospace**

In `src/components/Welcome.astro`, find the `.tagline` style (inside `.content`):

```css
		.tagline {
			font-size: clamp(1.1rem, 2.5vw, 1.4rem);
			font-weight: 400;
			color: var(--color-text-secondary);
			margin: 0 0 3rem 0;
			line-height: 1.4;
			opacity: 0;
			animation: fadeSlideUp 0.7s ease forwards;
			animation-delay: 0.35s;
		}
```

Replace with:

```css
		.tagline {
			font-family: var(--font-mono);
			font-size: clamp(1rem, 2.2vw, 1.2rem);
			font-weight: 400;
			color: var(--color-text-muted);
			margin: 0 0 3rem 0;
			line-height: 1.4;
			letter-spacing: 0.02em;
			opacity: 0;
			animation: fadeSlideUp 0.7s ease forwards;
			animation-delay: 0.35s;
		}
```

- [ ] **Step 2: Update social links — remove circle background**

Find the `.social-link` style:

```css
	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: var(--color-text-secondary);
		text-decoration: none;
		border-radius: 50%;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			color: var(--color-text-primary);
			background: var(--color-surface-alt);
			transform: translateY(-2px);
		}
	}
```

Replace with:

```css
	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		color: var(--color-text-muted);
		text-decoration: none;
		border-radius: 50%;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			color: var(--color-text-primary);
			transform: translateY(-2px);
		}
	}
```

- [ ] **Step 3: Update CTA button — filled black**

Find the `.btn` style:

```css
	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.8rem 2rem;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-accent);
		text-decoration: none;
		border: 1px solid var(--color-accent);
		background: transparent;
		transition: all 0.2s ease;

		&:hover {
			background: var(--color-accent);
			color: #ffffff;
		}
	}
```

Replace with:

```css
	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.8rem 2rem;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-text-inverse);
		text-decoration: none;
		border: 1px solid var(--color-accent);
		border-radius: 8px;
		background: var(--color-accent);
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			background: var(--color-accent-hover);
			border-color: var(--color-accent-hover);
			transform: translateY(-1px);
			box-shadow: 0 4px 12px var(--color-shadow);
		}
	}
```

- [ ] **Step 4: Verify Welcome section**

Check http://localhost:4321 — tagline should be monospace, button should be filled black with white text, social icons should have no background circle.

- [ ] **Step 5: Commit**

```bash
git add src/components/Welcome.astro
git commit -m "style: restyle Welcome section with monospace accents and filled CTA"
```

---

### Task 5: Restyle NavBar with Monospace Links

**Files:**
- Modify: `src/components/NavBar.astro`

- [ ] **Step 1: Add monospace font to nav links**

In `src/components/NavBar.astro`, find the `.nav-list li a` style:

```css
	.nav-list li a {
		color: var(--color-text-primary);
		text-decoration: none;
		font-weight: 500;
		transition: opacity 0.25s;
		border-radius: 4px;

		&:hover {
			opacity: 0.6;
		}
	}
```

Replace with:

```css
	.nav-list li a {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--color-text-primary);
		text-decoration: none;
		font-weight: 500;
		letter-spacing: 0.02em;
		transition: opacity 0.25s;
		border-radius: 4px;

		&:hover {
			opacity: 0.6;
		}
	}
```

- [ ] **Step 2: Verify navbar**

Nav links should now be in monospace font, slightly smaller than before.

- [ ] **Step 3: Commit**

```bash
git add src/components/NavBar.astro
git commit -m "style: use monospace font for nav links"
```

---

### Task 6: Restyle Introduction Section

**Files:**
- Modify: `src/components/introduction/Introduction.astro`

- [ ] **Step 1: Remove grayscale filter and pulse animation from portrait**

In `src/components/introduction/Introduction.astro`, find:

```css
				.intro-portrait {
					width: 100%;
					height: auto;
					border-radius: 20px;
					filter: grayscale(1) brightness(0.98)
						contrast(1.05);
					animation: introImagePulse 6s ease-in-out
						infinite;
					transition: all 0.3s ease-in-out;
				}
```

Replace with:

```css
				.intro-portrait {
					width: 100%;
					height: auto;
					border-radius: 20px;
					transition: all 0.3s ease-in-out;
				}
```

- [ ] **Step 2: Update image container hover — remove accent border**

Find:

```css
			&:hover {
				scale: 1.01;
				box-shadow:
					0 0 0 1px var(--color-shadow),
					0 8px 24px var(--color-shadow-strong);
				border-color: var(--color-accent-muted);
				.intro-portrait {
					filter: none;
				}
			}
```

Replace with:

```css
			&:hover {
				scale: 1.01;
				box-shadow: 0 4px 12px var(--color-shadow);
				.intro-portrait {
					transform: scale(1.01);
				}
			}
```

- [ ] **Step 3: Normalize image container border-radius**

Find:

```css
			.introduction-image {
				padding: 16px;
				height: fit-content;
				background: var(--color-surface);
				border: 1px solid var(--color-border);
				border-radius: 24px;
```

Replace with:

```css
			.introduction-image {
				padding: 16px;
				height: fit-content;
				background: var(--color-surface);
				border: 1px solid var(--color-border);
				border-radius: 12px;
```

- [ ] **Step 4: Verify Introduction section**

Portrait should show in full color, no pulse animation, 12px radius on container. Hover shows subtle shadow instead of accent border.

- [ ] **Step 5: Commit**

```bash
git add src/components/introduction/Introduction.astro
git commit -m "style: remove portrait filters and normalize Introduction styling"
```

---

### Task 7: Restyle Skill Cards

**Files:**
- Modify: `src/components/introduction/skill_card.astro`

- [ ] **Step 1: Update skill card styles**

In `src/components/introduction/skill_card.astro`, find:

```css
	.skill-card {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 18px 20px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		transition:
			border-color 0.25s,
			transform 0.25s,
			box-shadow 0.25s;
	}

	@media (hover: hover) {
		.skill-card:hover {
			border-color: var(--color-accent-muted);
			transform: translateY(-2px);
			box-shadow: 0 4px 10px var(--color-shadow-soft);
		}
	}
```

Replace with:

```css
	.skill-card {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 18px 20px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		box-shadow: 0 1px 3px var(--color-shadow-soft);
		transition:
			transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@media (hover: hover) {
		.skill-card:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px var(--color-shadow);
		}
	}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/introduction/skill_card.astro
git commit -m "style: normalize skill card borders and hover states"
```

---

### Task 8: Restyle Experience Section

**Files:**
- Modify: `src/components/experience/Experience.astro`

- [ ] **Step 1: Update timeline layout — remove alternating, use left-aligned**

In `src/components/experience/Experience.astro`, find the desktop media query (min-width: 850px):

```css
	@media (min-width: 850px) {
		.timeline {
			--center-gap: 4rem;
			gap: 3.5rem;
			padding-inline: 0.5rem;
		}
		.timeline-item {
			display: grid;
			grid-template-columns: 1fr var(--line-width) 1fr;
			align-items: center;
			min-height: 26px;
		}
		.timeline-item[data-index]:nth-of-type(odd) .card {
			grid-column: 1/2;
			justify-self: end;
			max-width: calc(100% - var(--center-gap));
			margin-right: var(--center-gap);
		}
		.timeline-item[data-index]:nth-of-type(even) .card {
			grid-column: 3/4;
			justify-self: start;
			max-width: calc(100% - var(--center-gap));
			margin-left: var(--center-gap);
		}
	}
```

Replace with:

```css
	@media (min-width: 850px) {
		.timeline {
			width: min(800px, 80%);
			gap: 2.5rem;
		}
	}
```

- [ ] **Step 2: Update timeline base styles — left-aligned line**

Find the `.timeline` and `timeline::before` styles:

```css
	.timeline {
		--line-width: 3px;
		width: min(1200px, 80%);
		list-style: none;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	/* Central vertical line (desktop) */
	.timeline::before {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: var(--line-width);
		transform: translateX(-50%);
		background: linear-gradient(
			to bottom,
			var(--color-primary-20) 0%,
			var(--color-primary-40) 40%,
			var(--color-primary-20) 100%
		);
	}
```

Replace with:

```css
	.timeline {
		--line-width: 1px;
		width: min(800px, 80%);
		list-style: none;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding-left: 2rem;
	}

	/* Left vertical line */
	.timeline::before {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0.5rem;
		width: var(--line-width);
		background: var(--color-border);
	}
```

- [ ] **Step 3: Update marker styles — small dot on left**

Find:

```css
	.timeline-item .marker {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-accent);
		box-shadow: 0 4px 10px -2px var(--color-shadow-strong);
	}
```

Replace with:

```css
	.timeline-item .marker {
		position: absolute;
		top: 1.6rem;
		left: -1.5rem;
		transform: translateX(-50%);
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-text-primary);
		border: 2px solid var(--color-background);
		box-shadow: 0 0 0 1px var(--color-border);
	}
```

- [ ] **Step 4: Update card styles — normalize border-radius, remove accent hover**

Find:

```css
	.timeline-item .card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
		box-shadow:
			0 2px 8px -2px var(--color-shadow-soft),
			0 4px 12px -3px var(--color-shadow);
		transition:
			transform 0.22s ease,
			box-shadow 0.22s ease,
			border-color 0.22s ease;
	}

	.timeline-item .card:hover {
		transform: translateY(-8px);
		border-color: var(--color-accent-muted);
		box-shadow:
			0 12px 28px -4px var(--color-shadow),
			0 20px 40px -6px var(--color-shadow-strong);
	}
```

Replace with:

```css
	.timeline-item .card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		box-shadow: 0 1px 3px var(--color-shadow-soft);
		transition:
			transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.timeline-item .card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--color-shadow);
	}
```

- [ ] **Step 5: Update meta/period to use monospace**

Find:

```css
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		font-size: 0.85rem;
		text-transform: capitalize;
		letter-spacing: 0.05em;
		font-weight: 500;
		color: var(--color-text-muted);
		margin: 0;
	}
```

Replace with:

```css
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		text-transform: capitalize;
		letter-spacing: 0.02em;
		font-weight: 400;
		color: var(--color-text-muted);
		margin: 0;
	}
```

- [ ] **Step 6: Update tech badges to monospace**

Find:

```css
	.tech div {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		font-weight: 700;
		padding: 0.5rem 0.85rem;
		border-radius: 12px;
		background: var(--badge-bg);
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		transition: all 0.2s ease;
	}
	.tech div:hover {
		border-color: var(--color-primary-40);
		color: var(--color-text-primary);
	}
```

Replace with:

```css
	.tech div {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.02em;
		font-weight: 400;
		padding: 0.35rem 0.65rem;
		border-radius: 4px;
		background: var(--color-surface-alt);
		color: var(--color-text-muted);
		transition: color 0.2s ease;
	}
	.tech div:hover {
		color: var(--color-text-primary);
	}
```

- [ ] **Step 7: Update mobile timeline styles**

Find:

```css
	@media (max-width: 850px) {
		.timeline::before {
			left: 0.4rem;
			width: 3px;
			transform: none;
			background: linear-gradient(
				to bottom,
				var(--color-primary-40) 0%,
				var(--color-primary-20) 100%
			);
			opacity: 0.4;
		}
		.timeline-item .marker {
			left: 0.5rem;
			width: 18px;
			height: 18px;
			top: 1.4rem;
			transform: translate(-50%, 0);
			box-shadow: 0 3px 8px -2px var(--color-shadow);
		}
		.timeline-item .card {
			margin-left: 2.2rem;
		}
	}
```

Replace with:

```css
	@media (max-width: 850px) {
		.timeline {
			padding-left: 1.5rem;
		}
		.timeline::before {
			left: 0.35rem;
		}
		.timeline-item .marker {
			left: -1.15rem;
		}
	}
```

- [ ] **Step 8: Remove tech badge stagger animation from script**

In the `<script>` section, find and remove the entire tech badges stagger block (lines ~386-414):

```javascript
				// Tech badges subtle stagger-in
				const badges =
					card.querySelectorAll(
						".tech div"
					);
				if (badges.length) {
					ScrollTrigger.batch(badges, {
						start: "top 90%",
						end: "top 30%",
						once: true,
						onEnter: (batch) => {
							gsap.fromTo(
								batch,
								{
									filter: "blur(6px)",
									opacity: 0,
									y: 8,
								},
								{
									filter: "blur(0px)",
									opacity: 1,
									y: 0,
									duration: 0.4,
									stagger: 0.06,
									ease: "power2.out",
								}
							);
						},
					});
				}
```

Remove this entire block. The card scroll animation already handles the entrance — badges inside will appear with the card.

- [ ] **Step 9: Verify Experience section**

Check http://localhost:4321/#experience — should show left-aligned timeline with thin line, small dots, monospace dates, no alternating layout, no badge stagger.

- [ ] **Step 10: Commit**

```bash
git add src/components/experience/Experience.astro
git commit -m "style: restyle Experience to minimal left timeline with monospace accents"
```

---

### Task 9: Restyle Technology Section — Inline List

**Files:**
- Modify: `src/components/technology/Technology.astro`
- Modify: `src/data/technologies.ts`

- [ ] **Step 1: Add category grouping to technologies data**

Replace the entire contents of `src/data/technologies.ts` with:

```typescript
export interface Skill {
	label: string;
	icon?: any;
}

export interface SkillGroup {
	category: string;
	skills: string[];
}

export const skillGroups: SkillGroup[] = [
	{
		category: "FRONTEND",
		skills: ["Astro", "React", "React Native", "TypeScript"],
	},
	{
		category: "BACKEND",
		skills: ["Node.js", "Express", "NestJs", "FastAPI", "Python", "Prisma"],
	},
	{
		category: "DATABASE",
		skills: ["PostgreSQL", "MongoDB"],
	},
	{
		category: "TOOLS & INFRA",
		skills: ["Docker", "Git", "Azure", "Jest", "Unity (C#)"],
	},
];

// Flat list for backward compatibility (SEO structured data, etc.)
export const allSkills: Skill[] = skillGroups.flatMap((g) =>
	g.skills.map((label) => ({ label }))
);
```

- [ ] **Step 2: Rewrite Technology component markup**

Replace the entire contents of `src/components/technology/Technology.astro` with:

```astro
---
import { skillGroups } from "../../data/technologies";
---

<section id="tech" class="tech-section" aria-labelledby="tech-title" itemscope itemtype="https://schema.org/ItemList">
	<h2 id="tech-title" class="tech-title">My Skills</h2>

	<div class="tech-list" role="list">
		{
			skillGroups.map((group, gi) => (
				<div class="tech-group" role="listitem">
					<span class="category-label">{group.category}</span>
					<span class="skill-names">
						{group.skills.map((skill, si) => (
							<>
								<span
									class="skill-name"
									itemprop="itemListElement"
									itemscope
									itemtype="https://schema.org/Thing"
								>
									<meta itemprop="position" content={String(gi * 10 + si + 1)} />
									<span itemprop="name">{skill}</span>
								</span>
								{si < group.skills.length - 1 && (
									<span class="separator" aria-hidden="true"> · </span>
								)}
							</>
						))}
					</span>
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
	}

	.tech-title {
		font-size: clamp(2rem, 5vw, 3rem);
		margin: 0;
		letter-spacing: 1px;
		font-weight: 600;
		text-align: center;
	}

	.tech-list {
		width: min(700px, 90%);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.tech-group {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.category-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		color: var(--color-text-primary);
		min-width: 110px;
		flex-shrink: 0;
	}

	.skill-names {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 400;
		color: var(--color-text-muted);
		line-height: 1.8;
	}

	.skill-name {
		transition: color 0.2s ease;
	}

	@media (hover: hover) {
		.skill-name:hover {
			color: var(--color-text-primary);
		}
	}

	.separator {
		color: var(--color-text-faint);
	}

	@media (max-width: 480px) {
		.tech-group {
			flex-direction: column;
			gap: 0.25rem;
		}
		.category-label {
			min-width: auto;
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

				// Title blur-in
				const title = section.querySelector(".tech-title");
				if (title) {
					gsap.fromTo(
						title,
						{ filter: "blur(6px)", opacity: 0, y: 16 },
						{
							filter: "blur(0px)",
							opacity: 1,
							y: 0,
							duration: 0.6,
							ease: "power2.out",
							scrollTrigger: {
								trigger: title,
								start: "top 90%",
								end: "top 60%",
								scrub: true,
							},
						}
					);
				}

				// Fade in the whole list
				const list = section.querySelector(".tech-list");
				if (list) {
					gsap.fromTo(
						list,
						{ filter: "blur(8px)", opacity: 0, y: 20 },
						{
							filter: "blur(0px)",
							opacity: 1,
							y: 0,
							duration: 0.8,
							ease: "power2.out",
							scrollTrigger: {
								trigger: list,
								start: "top 90%",
								end: "top 60%",
								scrub: true,
							},
						}
					);
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

- [ ] **Step 3: Check if Technology.astro in techs/ is used**

There's also `src/components/techs/Technology.astro` — check if `src/pages/index.astro` imports from `techs/` or `technology/`. Update the correct one. If both exist, determine which is active and update that one; delete or ignore the unused one.

- [ ] **Step 4: Verify Technology section**

Check http://localhost:4321/#tech — should show grouped inline text list with monospace font, category labels on the left, skills separated by dots. No badge grid, no icons, no random pulse animation.

- [ ] **Step 5: Commit**

```bash
git add src/data/technologies.ts src/components/technology/Technology.astro
git commit -m "style: replace tech badge grid with compact inline monospace list"
```

---

### Task 10: Restyle Project Cards

**Files:**
- Modify: `src/components/projects/ProjectCard.astro`

- [ ] **Step 1: Remove image desaturation**

In `src/components/projects/ProjectCard.astro`, find:

```css
	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: brightness(0.92) contrast(1.05) saturate(0.95);
		transition:
			transform 0.5s ease,
			filter 0.5s ease;
	}
```

Replace with:

```css
	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition:
			transform 0.5s ease,
			filter 0.5s ease;
	}
```

- [ ] **Step 2: Update card styling — normalize radius, remove accent hover**

Find:

```css
	.card {
		position: relative;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 24px;
		padding: 1.45rem 1.5rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.05rem;
		height: 96%;
		box-shadow:
			0 3px 8px -2px var(--color-shadow-soft),
			0 6px 18px -3px var(--color-shadow);
		transition:
			border-color 0.25s,
			transform 0.25s,
			box-shadow 0.25s;
	}

	@media (hover: hover) {
		.card:hover {
			border-color: var(--color-accent-muted);
			transform: translateY(-4px);
			box-shadow:
				0 10px 22px -4px var(--color-shadow),
				0 18px 36px -6px var(--color-shadow-strong);
		}
		.card:hover .media img {
			transform: scale(1.04);
			filter: brightness(0.98) contrast(1.08) saturate(1.05);
		}
	}
```

Replace with:

```css
	.card {
		position: relative;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.45rem 1.5rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.05rem;
		height: 96%;
		box-shadow: 0 1px 3px var(--color-shadow-soft);
		transition:
			transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@media (hover: hover) {
		.card:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px var(--color-shadow);
		}
		.card:hover .media img {
			transform: scale(1.02);
		}
	}
```

- [ ] **Step 3: Update media border-radius**

Find:

```css
	.media {
		position: relative;
		aspect-ratio: 16/9;
		width: 100%;
		margin: 0;
		overflow: hidden;
		border-radius: 14px;
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border);
	}
```

Replace with:

```css
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
```

- [ ] **Step 4: Update year badge and tech badges to monospace**

Find:

```css
	.year {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		padding: 0.4rem 0.65rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		color: var(--color-text-muted);
		background: var(--color-surface-alt);
	}
```

Replace with:

```css
	.year {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.02em;
		padding: 0.35rem 0.6rem;
		border-radius: 4px;
		color: var(--color-text-muted);
		background: var(--color-surface-alt);
	}
```

Find:

```css
	.badge {
		font-size: 0.7rem;
		letter-spacing: 0.07em;
		font-weight: 600;
		padding: 0.5rem 0.65rem;
		border-radius: 999px;
		background: var(--color-surface-alt);
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}
```

Replace with:

```css
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
```

- [ ] **Step 5: Update link buttons to filled black**

Find:

```css
	.link {
		position: relative;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		font-weight: 600;
		text-transform: uppercase;
		padding: 0.55rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface-alt);
		color: var(--color-text-primary);
		text-decoration: none;
		transition:
			background 0.25s,
			border-color 0.25s;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}
```

Replace with:

```css
	.link {
		position: relative;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.02em;
		font-weight: 500;
		text-transform: uppercase;
		padding: 0.5rem 0.8rem;
		border: 1px solid var(--color-accent);
		border-radius: 6px;
		background: var(--color-accent);
		color: var(--color-text-inverse);
		text-decoration: none;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}
```

Find:

```css
	@media (hover: hover) {
		.link:hover {
			background: var(--color-primary-20);
			border-color: var(--color-primary-40);
		}
	}
```

Replace with:

```css
	@media (hover: hover) {
		.link:hover {
			background: var(--color-accent-hover);
			border-color: var(--color-accent-hover);
		}
	}
```

- [ ] **Step 6: Verify Projects section**

Project images should show full color. Cards have 12px radius, subtle shadow. Year badges and tech badges are monospace without pill shape. Link buttons are filled dark.

- [ ] **Step 7: Commit**

```bash
git add src/components/projects/ProjectCard.astro
git commit -m "style: restyle project cards with monospace badges and filled link buttons"
```

---

### Task 11: Restyle Footer with Monospace Accents

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Update footer heading, stack info, and meta to monospace**

In `src/components/Footer.astro`, find:

```css
	.heading {
		margin: 0 0 0.65rem;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 600;
		color: var(--color-text-muted);
	}
```

Replace with:

```css
	.heading {
		font-family: var(--font-mono);
		margin: 0 0 0.65rem;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 500;
		color: var(--color-text-muted);
	}
```

Find:

```css
	.stack {
		margin: 0;
		font-size: 0.76rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--color-text-muted);
	}
```

Replace with:

```css
	.stack {
		font-family: var(--font-mono);
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-weight: 400;
		color: var(--color-text-muted);
	}
```

Find:

```css
	.meta {
		margin: 0;
		font-size: 0.8rem;
		opacity: 0.85;
		line-height: 1.4;
	}
```

Replace with:

```css
	.meta {
		font-family: var(--font-mono);
		margin: 0;
		font-size: 0.75rem;
		opacity: 0.85;
		line-height: 1.4;
	}
```

- [ ] **Step 2: Verify Footer**

Footer headings, stack info, and meta text should all be in monospace.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "style: use monospace font in footer labels and meta info"
```

---

### Task 12: Reduce Custom Cursor Glow

**Files:**
- Modify: `src/styles/CustomCursor.css`

- [ ] **Step 1: Reduce glow intensity in light mode**

In `src/styles/CustomCursor.css`, find:

```css
.cursor-glow {
    position: fixed;
    width: 26vmin;
    height: 24vmin;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9998;
    will-change: transform;
    border-radius: 50%;
    --glow-opacity: 0.65;
    --glow-blur: 24px;
    background: radial-gradient(
        35% 35% at 50% 50%,
        rgba(0, 0, 0, 0.45),
        rgba(0, 0, 0, 0.22) 55%,
        transparent 100%
    );
    filter: blur(var(--glow-blur));
    opacity: var(--glow-opacity);
    mix-blend-mode: multiply;
    animation: glowPulse 1s ease-in-out infinite;
}
```

Replace with:

```css
.cursor-glow {
    position: fixed;
    width: 26vmin;
    height: 24vmin;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9998;
    will-change: transform;
    border-radius: 50%;
    --glow-opacity: 0.35;
    --glow-blur: 28px;
    background: radial-gradient(
        35% 35% at 50% 50%,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.08) 55%,
        transparent 100%
    );
    filter: blur(var(--glow-blur));
    opacity: var(--glow-opacity);
    mix-blend-mode: soft-light;
    animation: glowPulse 2s ease-in-out infinite;
}
```

- [ ] **Step 2: Reduce dark mode glow**

Find:

```css
:root[data-theme='dark'] .cursor-glow {
    background: radial-gradient(
        35% 35% at 50% 50%,
        color-mix(in oklab, var(--color-primary) 45%, transparent),
        color-mix(in oklab, var(--color-primary) 12%, transparent) 60%,
        transparent 100%
    );
    --glow-opacity: 0.9;
    mix-blend-mode: lighten;
}
```

Replace with:

```css
:root[data-theme='dark'] .cursor-glow {
    background: radial-gradient(
        35% 35% at 50% 50%,
        color-mix(in oklab, var(--color-primary) 30%, transparent),
        color-mix(in oklab, var(--color-primary) 8%, transparent) 60%,
        transparent 100%
    );
    --glow-opacity: 0.6;
    mix-blend-mode: lighten;
}
```

- [ ] **Step 3: Slow down pulse animation**

Find:

```css
@keyframes glowPulse {
    0%, 100% {
        scale: 1;
        filter: blur(var(--glow-blur));
        opacity: var(--glow-opacity);
    }
    50% {
        scale: 1.08;
        filter: blur(calc(var(--glow-blur) + 6px));
        opacity: calc(var(--glow-opacity) + 0.12);
    }
}
```

Replace with:

```css
@keyframes glowPulse {
    0%, 100% {
        scale: 1;
        filter: blur(var(--glow-blur));
        opacity: var(--glow-opacity);
    }
    50% {
        scale: 1.04;
        filter: blur(calc(var(--glow-blur) + 4px));
        opacity: calc(var(--glow-opacity) + 0.05);
    }
}
```

- [ ] **Step 4: Verify cursor**

Move cursor around the page — glow should be much subtler in both light and dark mode. Slower pulsing (2s cycle instead of 1s).

- [ ] **Step 5: Commit**

```bash
git add src/styles/CustomCursor.css
git commit -m "style: reduce cursor glow intensity and slow pulse animation"
```

---

### Task 13: Final Visual Verification

- [ ] **Step 1: Full-page check in light mode**

Scroll through the entire page in light mode. Verify:
- Warm off-white background (#faf8f6)
- White cards floating on warm background
- Hairline borders (#eee)
- Monospace in: tagline, nav links, experience dates, tech badges, project year/badges, project link buttons, footer headings/meta
- Filled black CTA button
- No grayscale portrait
- Left-aligned timeline
- Inline tech list with categories
- No random badge pulse
- Consistent 12px border-radius on cards
- Subtle shadows, no accent-colored borders on hover

- [ ] **Step 2: Full-page check in dark mode**

Toggle dark mode and verify:
- Warm near-black background (#111110)
- Dark warm cards (#1c1c1a)
- White accent for buttons/links
- All monospace accents work in dark mode
- Cursor glow is subtle

- [ ] **Step 3: Mobile check**

Resize browser to mobile width (~375px). Verify:
- Timeline stays left-aligned
- Tech list stacks category label above skills
- Cards are full-width
- Hamburger menu works
- No horizontal overflow

- [ ] **Step 4: Build check**

Run: `npm run build`

Expected: Build completes with no errors.

- [ ] **Step 5: Commit any remaining fixes**

If any tweaks were needed during verification, commit them:

```bash
git add -A
git commit -m "style: final adjustments for monochrome refined reskin"
```
