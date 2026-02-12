// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';

// https://astro.build/config
const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

export default defineConfig({
  // Use env to override site URL and base path per deployment target
  site: env.DEFAULT_PATH || "https://pangilinanervin22.github.io/",
  base: env.DEFAULT_BASE || "/portfolio",
  integrations: [mdx(), sitemap(), react()],
  output: "static",
  experimental: {
    svgo : true
  }
});


