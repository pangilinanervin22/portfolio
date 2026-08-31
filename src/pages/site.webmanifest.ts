import type { APIRoute } from "astro";
import { SITE_TITLE } from "../consts";

// Generated at build time so start_url/scope/icon paths follow the configured
// base path (`/` in dev, `/portfolio` on GitHub Pages) instead of being hardcoded.
export const GET: APIRoute = () => {
	const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

	const manifest = {
		name: `${SITE_TITLE} Portfolio`,
		short_name: "Ervin P.",
		description: "Personal portfolio of Ervin Pangilinan, full-stack developer.",
		start_url: base,
		scope: base,
		display: "standalone",
		background_color: "#faf8f6",
		theme_color: "#faf8f6",
		icons: [
			{ src: `${base}favicon.svg`, sizes: "any", type: "image/svg+xml" },
			{ src: `${base}favicon.png`, sizes: "256x256", type: "image/png" },
		],
	};

	return new Response(JSON.stringify(manifest, null, "\t"), {
		headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
	});
};
