import { test, expect, type Page } from "@playwright/test";

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
