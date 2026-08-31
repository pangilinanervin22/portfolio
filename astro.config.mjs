// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export default defineConfig({
  site: env.DEFAULT_PATH || "https://pangilinanervin22.github.io/",
  base: env.DEFAULT_BASE || "/portfolio",
  integrations: [
    // On a single-page site with a base path the sitemap plugin emits both
    // "/portfolio" and "/portfolio/"; keep only the canonical trailing-slash URL.
    sitemap({ filter: (page) => page.endsWith("/") }),
    react(),
  ],
  output: "static"
});


