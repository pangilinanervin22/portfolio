import { defineConfig, devices } from "@playwright/test";

// The smoke tests run against a production build served under a base path
// (`/portfolio`), although the live site sits at the root: the dev server's `/`
// base hides a whole class of link/asset bugs, and a build that works under a
// base path works at the root too.
const BASE = "/portfolio";
const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

// Locally, reuse the machine's installed Chrome instead of downloading Chromium.
const channel = process.env.CI ? undefined : "chrome";

export default defineConfig({
	testDir: "./tests",
	timeout: 30_000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL: `${ORIGIN}${BASE}/`,
		trace: "retain-on-failure",
	},
	projects: [
		{ name: "desktop", use: { ...devices["Desktop Chrome"], channel } },
		{ name: "mobile", use: { ...devices["Pixel 7"], channel } },
	],
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT}`,
		url: `${ORIGIN}${BASE}/`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		env: {
			DEFAULT_PATH: "https://pangilinanervin22.vercel.app/",
			DEFAULT_BASE: BASE,
		},
	},
});
