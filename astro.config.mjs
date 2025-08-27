// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Use your GitHub Pages origin; base controls the subpath ("/portfolio/")
  site: "https://pangilinanervin22.github.io/",
  // Ensure base has leading and trailing slash so import.meta.env.BASE_URL resolves as "/portfolio/"
  base: "/portfolio",
  integrations: [mdx(), sitemap(), react()],
  output: "static",
});


