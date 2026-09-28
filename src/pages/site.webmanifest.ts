import type { APIRoute } from "astro";
import { SITE_TITLE } from "../consts";

// Generated at build time so start_url/scope/icon paths follow the configured
// base path (`/` in production, `/portfolio` in the smoke-test build) instead of
// being hardcoded.
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
		// The PNGs are full bleed with the letters inside the 80% safe circle, so the
		// 512 also serves as the maskable icon Android crops to its own shape.
		icons: [
			{ src: `${base}favicon.svg`, sizes: "any", type: "image/svg+xml" },
			{ src: `${base}icon-192.png`, sizes: "192x192", type: "image/png" },
			{ src: `${base}icon-512.png`, sizes: "512x512", type: "image/png" },
			{ src: `${base}icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
		],
	};

	return new Response(JSON.stringify(manifest, null, "\t"), {
		headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
	});
};
