import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Collects console errors, uncaught exceptions and failed requests for the page. */
function watchForProblems(page: Page): string[] {
	const problems: string[] = [];
	page.on("console", (m) => {
		if (m.type() === "error") problems.push(`console error: ${m.text()}`);
	});
	page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
	page.on("response", (r) => {
		if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
	});
	return problems;
}

/** The theme toggle and nav links live inside the hamburger sheet on small screens. */
async function openMenuIfMobile(page: Page, isMobile: boolean) {
	if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
}

test("loads with no console errors, page errors, or failed requests", async ({ page }) => {
	const problems = watchForProblems(page);
	await page.goto("./");
	await expect(page.getByRole("heading", { level: 1 })).toContainText("Ervin");
	await page.waitForLoadState("networkidle");
	expect(problems).toEqual([]);
});

test("highlighted terms in the hero keep their surrounding spaces", async ({ page }) => {
	// Astro trims whitespace around line breaks that touch a tag, which silently
	// glues words together ("andNestJS"). Check every highlight's neighbours.
	await page.goto("./");
	const glued = await page.locator(".tagline-mark").evaluateAll((marks) =>
		marks
			.filter((el) => {
				const prev = el.previousSibling;
				const next = el.nextSibling;
				const before = prev?.nodeType === Node.TEXT_NODE ? (prev.textContent ?? "").slice(-1) : " ";
				const after = next?.nodeType === Node.TEXT_NODE ? (next.textContent ?? "").charAt(0) : " ";
				return /\w/.test(before) || /\w/.test(after);
			})
			.map((el) => el.textContent),
	);
	expect(glued).toEqual([]);
});

test("nav links scroll within the page instead of reloading it", async ({ page, isMobile }) => {
	await page.goto("./");
	await page.evaluate(() => {
		(window as Window & { __sameDocument?: boolean }).__sameDocument = true;
	});
	await openMenuIfMobile(page, isMobile);
	await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About" }).click();
	await expect(page).toHaveURL(/#introduction$/);
	await expect(page.locator("#introduction")).toBeInViewport();
	// A full navigation would have thrown the marker away.
	expect(
		await page.evaluate(() => (window as Window & { __sameDocument?: boolean }).__sameDocument),
	).toBe(true);
});

test("mobile menu is keyboard-operable and closes after choosing a link", async ({ page, isMobile }) => {
	test.skip(!isMobile, "the hamburger only exists on small screens");
	await page.goto("./");
	const button = page.getByRole("button", { name: "Menu" });
	await expect(button).toHaveAttribute("aria-expanded", "false");

	await button.focus();
	await page.keyboard.press("Enter");
	await expect(button).toHaveAttribute("aria-expanded", "true");
	await page.keyboard.press("Escape");
	await expect(button).toHaveAttribute("aria-expanded", "false");

	await button.click();
	await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Experience" }).click();
	await expect(button).toHaveAttribute("aria-expanded", "false");
	await expect(page.locator("#experience")).toBeInViewport();
});

test("theme toggle flips the theme, persists it, and keeps theme-color in sync", async ({ page, isMobile }) => {
	const problems = watchForProblems(page);
	await page.goto("./");
	const html = page.locator("html");
	const before = await html.getAttribute("data-theme");
	const after = before === "dark" ? "light" : "dark";

	await openMenuIfMobile(page, isMobile);
	const toggle = page.getByRole("button", { name: /switch to .* theme/i });
	// Both icons are in the DOM; exactly one may be visible for the active theme.
	await expect(toggle.locator("svg:visible")).toHaveCount(1);
	await toggle.click();
	await expect(html).toHaveAttribute("data-theme", after);
	await expect(toggle.locator("svg:visible")).toHaveCount(1);
	expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(after);
	const themeColor = await page.locator('meta[name="theme-color"]').getAttribute("content");
	expect(themeColor).toBe(after === "dark" ? "#111110" : "#faf8f6");

	await page.reload();
	await expect(html).toHaveAttribute("data-theme", after);
	expect(problems).toEqual([]);
});

test("project screenshots are letterboxed, never stretched", async ({ page }) => {
	await page.goto("./#projects");
	const images = page.locator("#projects .media img");
	await expect(images.first()).toBeVisible();
	const fits = await images.evaluateAll((els) => els.map((el) => getComputedStyle(el).objectFit));
	expect(fits.length).toBeGreaterThan(0);
	for (const fit of fits) expect(fit).toBe("contain");
});

test("custom cursor activates only for fine pointers", async ({ page, isMobile }) => {
	await page.goto("./");
	const html = page.locator("html");
	if (isMobile) {
		await page.waitForTimeout(500);
		await expect(html).not.toHaveClass(/has-custom-cursor/);
		await expect(page.locator(".cursor-cross")).toBeHidden();
	} else {
		await expect(html).toHaveClass(/has-custom-cursor/);
		await page.mouse.move(300, 300);
		await expect(page.locator(".cursor-cross")).toBeVisible();
	}
});

test("custom cursor stays under the pointer while pressed", async ({ page, isMobile }) => {
	test.skip(isMobile, "no custom cursor on touch devices");
	await page.goto("./");
	await expect(page.locator("html")).toHaveClass(/has-custom-cursor/);

	const centre = async (selector: string) => {
		const box = await page.locator(selector).boundingBox();
		if (!box) throw new Error(`${selector} has no box`);
		return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
	};

	await page.mouse.move(400, 400);
	await page.waitForTimeout(400); // let the lerped frame catch up
	const idle = await centre(".cursor-cross");
	await page.mouse.down();
	await page.waitForTimeout(300); // press transitions (rotate / scale) finish
	const pressedCross = await centre(".cursor-cross");
	const pressedFrame = await centre(".cursor-frame");
	await page.mouse.up();

	for (const c of [idle, pressedCross, pressedFrame]) {
		expect(Math.abs(c.x - 400)).toBeLessThan(4);
		expect(Math.abs(c.y - 400)).toBeLessThan(4);
	}
});

test("web fonts are served and applied", async ({ page }) => {
	const problems = watchForProblems(page);
	await page.goto("./");
	await page.evaluate(() => document.fonts.ready);
	const loaded = await page.evaluate(() =>
		[...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")),
	);
	// The Fonts API hashes family names ("Outfit-d506c…") and adds "… fallback: Arial" faces.
	for (const family of ["Outfit", "Sora", "JetBrains Mono"]) {
		expect(loaded.some((f) => f.startsWith(family) && !f.includes("fallback"))).toBe(true);
	}
	expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Outfit");
	expect(await page.locator(".tagline").first().evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Sora");
	expect(problems).toEqual([]);
});

test("resume button points at a downloadable PDF that exists", async ({ page }) => {
	await page.goto("./");
	const link = page.getByRole("navigation", { name: /resume/i }).getByRole("link", { name: "Resume" });
	await expect(link).toHaveAttribute("download", "");
	const href = await link.getAttribute("href");
	expect(href).toMatch(/\/Ervin_Pangilinan_Resume\.pdf$/);
	const response = await page.request.get(href!);
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("pdf");
});

test("removed pages are gone", async ({ page }) => {
	const response = await page.goto("./about/");
	expect(response?.status()).toBe(404);
});

for (const theme of ["light", "dark"] as const) {
	test(`no WCAG 2.1 AA violations in ${theme} mode`, async ({ page }) => {
		// The inline <head> script reads this before first paint.
		await page.addInitScript((t) => {
			try {
				localStorage.setItem("theme", t);
			} catch {
				/* ignore */
			}
		}, theme);
		await page.goto("./");
		await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
		// Reveal the scroll-animated sections so their text is audited too, then
		// wait for every finite animation/transition (hero fade-ins, reveals) to
		// settle; axe would otherwise sample half-faded text as low contrast.
		await page.evaluate(async () => {
			document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
			const finite = document
				.getAnimations()
				.filter((a) => a.effect?.getTiming().iterations !== Infinity);
			await Promise.all(finite.map((a) => a.finished.catch(() => undefined)));
		});

		const results = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();
		const violations = results.violations.map(
			(v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 4).map((n) => n.target.join(" ")).join(" | ")}`,
		);
		expect(violations).toEqual([]);
	});
}
