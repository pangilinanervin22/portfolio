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

/** Pixel size from a PNG's IHDR chunk. */
function pngSize(png: Buffer): [number, number] {
	return [png.readUInt32BE(16), png.readUInt32BE(20)];
}

/** Frame widths listed in an .ico directory (a stored 0 means 256). */
function icoSizes(ico: Buffer): number[] {
	const count = ico.readUInt16LE(4);
	return Array.from({ length: count }, (_, i) => ico[6 + 16 * i] || 256);
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

test("the nav stays stuck to the top while the page scrolls", async ({ page }) => {
	// `overflow: hidden` on body turns it into a scroll container that never scrolls,
	// and the sticky nav then rides away with the page without any error to notice.
	await page.goto("./");
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	await expect
		.poll(() => page.locator(".navbar").evaluate((el) => Math.round(el.getBoundingClientRect().top)))
		.toBe(0);
});

test("the sticky nav keeps its backdrop blur in the production CSS", async ({ page }) => {
	// The minifier reduces `backdrop-filter` + `-webkit-backdrop-filter` to the
	// prefixed form alone when the unprefixed one comes first, and Chromium and
	// Firefox ignore that. Only a production build shows it, which is what runs here.
	await page.goto("./");
	const blur = await page.locator(".navbar").evaluate((el) => getComputedStyle(el).backdropFilter);
	expect(blur).toContain("blur");
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
	expect(themeColor).toBe(after === "dark" ? "#0e2f63" : "#faf8f6");

	await page.reload();
	await expect(html).toHaveAttribute("data-theme", after);
	expect(problems).toEqual([]);
});

test("a first visit paints a theme but never persists one", async ({ page, isMobile }) => {
	// Writing the system-derived theme on load would freeze every first-time visitor on
	// whatever their OS happened to be, and the site could never follow it again.
	await page.goto("./");
	await expect(page.locator("html")).toHaveAttribute("data-theme", /^(light|dark)$/);
	expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();

	// Only an actual click is a choice worth remembering.
	await openMenuIfMobile(page, isMobile);
	await page.getByRole("button", { name: /switch to .* theme/i }).click();
	expect(await page.evaluate(() => localStorage.getItem("theme"))).not.toBeNull();
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
	for (const family of ["Outfit", "JetBrains Mono"]) {
		expect(loaded.some((f) => f.startsWith(family) && !f.includes("fallback"))).toBe(true);
	}
	expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Outfit");
	expect(await page.locator(".tagline").first().evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Outfit");
	// The faces have to reach nested spans too. A `font-family` on `*` resets every
	// child to the body face, so a mono label's inner spans quietly rendered in Outfit.
	const family = (selector: string) =>
		page.locator(selector).first().evaluate((el) => getComputedStyle(el).fontFamily);
	expect(await family("[data-tb-index]")).toContain("JetBrains Mono");
	expect(await family(".portrait-caption span")).toContain("JetBrains Mono");
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

test("the share card exists and matches its declared dimensions", async ({ page }) => {
	await page.goto("./");
	const src = await page.locator('meta[property="og:image"]').getAttribute("content");
	expect(src).toMatch(/\/og-card\.png$/);

	// og:image is absolute against the production origin, so fetch it by path locally.
	const response = await page.request.get(new URL(src!).pathname);
	expect(response.status()).toBe(200);

	// A square image under `summary_large_image` gets cropped; the declared size has to
	// be the real size or scrapers letterbox it.
	const png = await response.body();
	expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
	await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
	await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
		"content",
		"summary_large_image",
	);
});

test("icons for tabs, search results and home screens exist at the sizes they declare", async ({ page }) => {
	// Each consumer asks for a different file (tabs take the SVG, search engines a PNG
	// larger than 48px, iOS the apple-touch icon, older clients the .ico), so a missing
	// file or a wrong size only shows up in the one place that uses it.
	await page.goto("./");
	const fetchLink = async (selector: string) => {
		const link = page.locator(selector);
		await expect(link, selector).toHaveCount(1);
		const href = (await link.getAttribute("href"))!;
		const response = await page.request.get(href);
		expect(response.status(), href).toBe(200);
		return { response, sizes: await link.getAttribute("sizes") };
	};

	const svg = await fetchLink('link[rel="icon"][type="image/svg+xml"]');
	expect(svg.response.headers()["content-type"]).toContain("image/svg+xml");

	const png = await fetchLink('link[rel="icon"][type="image/png"]');
	const [width, height] = pngSize(await png.response.body());
	expect(png.sizes).toBe(`${width}x${height}`);
	expect(width).toBe(height);
	expect(width).toBeGreaterThan(48);

	const touch = await fetchLink('link[rel="apple-touch-icon"]');
	expect(pngSize(await touch.response.body())).toEqual([180, 180]);

	const ico = await fetchLink('link[rel~="icon"][href$=".ico"]');
	expect(icoSizes(await ico.response.body())).toEqual(expect.arrayContaining([16, 32]));
});

test("the web manifest lists 192 and 512 icons that exist at those sizes", async ({ page }) => {
	// Android and install prompts need both sizes; a manifest entry whose file is
	// missing or a different size is silently skipped.
	await page.goto("./");
	const href = (await page.locator('link[rel="manifest"]').getAttribute("href"))!;
	const manifest = await (await page.request.get(href)).json();
	const pngs: string[] = [];
	for (const icon of manifest.icons as { src: string; sizes: string; type: string }[]) {
		const response = await page.request.get(icon.src);
		expect(response.status(), icon.src).toBe(200);
		if (icon.type === "image/png") {
			const [w, h] = pngSize(await response.body());
			expect(`${w}x${h}`, icon.src).toBe(icon.sizes);
			pngs.push(icon.sizes);
		}
	}
	expect(pngs).toEqual(expect.arrayContaining(["192x192", "512x512"]));
});

test("the home page tells search engines the site's name", async ({ page }) => {
	// Without WebSite data Google guesses the name above the result, and on a shared
	// host it guessed the host ("Vercel"). The data only counts on the home page and
	// must point at the home page URL.
	await page.goto("./");
	const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
	const items = blocks.map((b) => JSON.parse(b)).flatMap((d) => d["@graph"] ?? [d]);
	const site = items.find((d) => d["@type"] === "WebSite");
	expect(site?.name).toBe("Ervin Pangilinan");
	expect(site?.url).toBe(await page.locator('link[rel="canonical"]').getAttribute("href"));
	await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Ervin Pangilinan");
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
		// Wait for every finite animation (the name drawing itself in, the hero
		// fade-in) to settle; axe would otherwise sample outlined or half-faded
		// text as low contrast.
		await page.evaluate(async () => {
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

test("the title block counts sheets as the page scrolls", async ({ page }) => {
	await page.goto("./");
	const counter = page.locator("[data-tb-index]");
	const name = page.locator("[data-tb-name]");
	await expect(counter).toHaveText("01");
	await expect(name).toHaveText("Cover");

	await page.locator("#experience").scrollIntoViewIfNeeded();
	await expect(counter).toHaveText("03");
	await expect(name).toHaveText("Experience");

	// The last sheet is short, so reaching the end of the page must count as being on it.
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	await expect(counter).toHaveText("06");
	await expect(name).toHaveText("Contact");
});

test("the title block never covers text, on the cover or past it", async ({ page, isMobile }) => {
	test.skip(isMobile, "the block is static on small screens");
	test.setTimeout(120_000); // five screen sizes, every 250px of the page
	// Fixed to the corner, the full block sat on top of project descriptions. It now
	// stays full only while the cover is under it and shrinks to the sheet counter in
	// the margin after that; narrower screens keep it static on the cover.
	// 1440x760 and 1600x800 are a 1440 or 1600 laptop once the browser takes its share
	for (const [width, height] of [
		[1280, 900],
		[1440, 900],
		[1440, 760],
		[1600, 800],
		[1920, 900],
	]) {
		await page.setViewportSize({ width, height });
		await page.goto("./");
		await page.evaluate(() => document.fonts.ready);
		const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
		for (let y = 0; y <= max + 250; y += 250) {
			await page.evaluate((top) => window.scrollTo(0, top), Math.min(y, max));
			// let the rAF-throttled tracker catch up
			await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
			const covered = await page.evaluate(() => {
				const block = document.querySelector(".title-block")!;
				if (getComputedStyle(block).position !== "fixed") return [];
				const box = block.getBoundingClientRect();
				const hits: string[] = [];
				const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
				const range = document.createRange();
				for (let node = walker.nextNode(); node; node = walker.nextNode()) {
					const text = node.textContent?.trim();
					const el = node.parentElement;
					if (!text || !el || block.contains(el)) continue;
					if (el.closest(".navbar, .visually-hidden, .cursor-frame, .skip-link")) continue;
					range.selectNodeContents(node);
					for (const r of range.getClientRects()) {
						const overlaps =
							r.width > 0 && r.left < box.right && r.right > box.left && r.top < box.bottom && r.bottom > box.top;
						if (overlaps) hits.push(text.slice(0, 40));
					}
				}
				return hits;
			});
			expect(covered, `${width}x${height}, scrolled to ${Math.min(y, max)}`).toEqual([]);
		}
	}

	// Past the cover on a wide screen, the counter is what remains.
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("./");
	await expect(page.locator(".title-block")).not.toHaveClass(/is-compact/);
	await page.locator("#projects").scrollIntoViewIfNeeded();
	await expect(page.locator(".title-block")).toHaveClass(/is-compact/);
	await expect(page.locator("[data-tb-index]")).toBeVisible();
	await expect(page.locator("[data-tb-name]")).toHaveText("Work");
});

test("the hero's results are figures the page states, visibly, further down", async ({ page }) => {
	// The results column repeats numbers from the experience and project copy. It must
	// never show a number that copy does not, and the copy must show it without a click
	// (innerText leaves out the contents of a closed <details>).
	await page.goto("./");
	const figures = await page.locator("#welcome .results .fig").allTextContents();
	expect(figures).toEqual(["~30,000", "~45%", "30%+", "~2,000+"]);
	const below = (await page.locator("#experience, #projects").allInnerTexts()).join(" ");
	for (const figure of figures) expect(below).toContain(figure);
});

test("experience entries lead with the employer and show every highlight", async ({ page }) => {
	await page.goto("./");
	const entries = page.locator("#experience .entry");
	await expect(entries).toHaveCount(4);
	await expect(entries.nth(0).locator("h3")).toHaveText("Cosmic Society");
	await expect(entries.nth(1).locator("h3")).toHaveText("HEQS Group");
	await expect(entries.nth(0).locator(".role")).toHaveText("Full-stack Developer");

	// No fold: the owner wants every highlight in view, with no "Show more" control.
	await expect(page.locator("#experience details, #experience summary")).toHaveCount(0);
	await expect(entries.nth(0).locator(".highlights > li:visible")).toHaveCount(5);
	await expect(entries.nth(1).locator(".highlights > li:visible")).toHaveCount(5);
});

test("About lists what I build as ruled rows and keeps what I'm exploring", async ({ page }) => {
	await page.goto("./");
	const about = page.locator("#introduction");
	await expect(about.locator(".build-row")).toHaveCount(4);
	await expect(about.locator(".skill-card")).toHaveCount(0);
	await expect(about).toContainText("AI automation pipelines");
});

test("on phones the hero links sit in two even rows", async ({ page, isMobile }) => {
	test.skip(!isMobile, "the desktop links sit in one row");
	await page.goto("./");
	const boxes = await page
		.locator(".text-links a")
		.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()).map((r) => ({ top: Math.round(r.top), width: Math.round(r.width) })));
	expect(boxes).toHaveLength(4);
	expect(new Set(boxes.map((b) => b.top)).size).toBe(2);
	expect(Math.max(...boxes.map((b) => b.width)) - Math.min(...boxes.map((b) => b.width))).toBeLessThanOrEqual(1);
});

test("the colophon keeps the space between the year and the name", async ({ page }) => {
	// Astro trims the whitespace at a line break that touches a tag: "© 2026Ervin".
	await page.goto("./");
	const footer = await page.locator("footer").innerText();
	expect(footer).toMatch(/© \d{4} Ervin Pangilinan/);
});

test("the contact sheet ends on the address, large, on one line and copyable", async ({
	page,
	context,
	isMobile,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("./");
	const mail = page.locator(".cta-mail");
	await mail.scrollIntoViewIfNeeded();
	await expect(mail).toHaveAttribute("href", "mailto:pangilinanervin22@gmail.com");
	const fit = await mail.evaluate((el) => {
		const r = el.getBoundingClientRect();
		const size = parseFloat(getComputedStyle(el).fontSize);
		return { size, oneLine: r.height < size * 1.8, inside: r.left >= 0 && r.right <= document.documentElement.clientWidth };
	});
	expect(fit.oneLine).toBe(true);
	expect(fit.inside).toBe(true);
	if (!isMobile) expect(fit.size).toBeGreaterThanOrEqual(56);

	await page.getByRole("button", { name: "Copy address" }).click();
	await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("pangilinanervin22@gmail.com");
});

test("the hero dimension line measures the rendered name", async ({ page }) => {
	await page.goto("./");
	await page.evaluate(() => document.fonts.ready);
	const label = page.locator(".name-dim-wrap .dim-label");
	await expect(label).toHaveText(/^\d+ px$/);
	const measured = Number((await label.textContent())!.replace(" px", ""));
	const ink = await page.locator("h1 .name-line").evaluateAll((lines) => {
		const rects = lines.map((l) => l.getBoundingClientRect());
		return Math.max(...rects.map((r) => r.right)) - Math.min(...rects.map((r) => r.left));
	});
	expect(Math.abs(measured - ink)).toBeLessThan(2);
});
