import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://pangilinanervin22.github.io/porfolio",
	integrations: [mdx(), sitemap()],
});
