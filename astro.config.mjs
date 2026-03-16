// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export default defineConfig({
  site: env.DEFAULT_PATH || "https://pangilinanervin22.github.io/",
  base: env.DEFAULT_BASE || "/portfolio",
  integrations: [sitemap(), react()],
  output: "static",
  experimental: {
    svgo: true
  }
});


