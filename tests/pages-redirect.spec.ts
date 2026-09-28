import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

// GitHub Pages no longer serves the site: `deploy.yml` publishes the page in
// `.github/pages-redirect/`, which sends the old address on to the Vercel home.
// Both hosts are stood in for here, so this runs without the network.
const OLD = "https://pangilinanervin22.github.io/portfolio";
const HOME = "https://pangilinanervin22.vercel.app";
const forwarder = readFileSync(new URL("../.github/pages-redirect/index.html", import.meta.url), "utf8");

test.beforeEach(async ({ page }) => {
	// GitHub Pages answers the folder with index.html and anything else with 404.html,
	// which deploy.yml copies from index.html.
	await page.route(
		(url) => url.hostname === "pangilinanervin22.github.io",
		(route) =>
			route.fulfill({
				status: new URL(route.request().url()).pathname === "/portfolio/" ? 200 : 404,
				contentType: "text/html",
				body: forwarder,
			}),
	);
	await page.route(
		(url) => url.hostname === "pangilinanervin22.vercel.app",
		(route) => route.fulfill({ contentType: "text/html", body: "<p>home</p>" }),
	);
});

const arrivedHome = (url: URL) => url.hostname === "pangilinanervin22.vercel.app";

test("the old home page forwards to the new one and keeps the section", async ({ page }) => {
	await page.goto(`${OLD}/#projects`, { waitUntil: "commit" });
	await page.waitForURL(arrivedHome);
	expect(page.url()).toBe(`${HOME}/#projects`);
});

test("old deep links forward to the same path on the new home", async ({ page }) => {
	await page.goto(`${OLD}/Ervin_Pangilinan_Resume.pdf`, { waitUntil: "commit" });
	await page.waitForURL(arrivedHome);
	expect(page.url()).toBe(`${HOME}/Ervin_Pangilinan_Resume.pdf`);
});
