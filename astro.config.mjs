// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export default defineConfig({
  site: env.DEFAULT_PATH || "https://pangilinanervin22.github.io/",
  base: env.DEFAULT_BASE || "/portfolio",
  integrations: [
    // On a single-page site with a base path the sitemap plugin emits both
    // "/portfolio" and "/portfolio/"; keep only the canonical trailing-slash URL.
    sitemap({ filter: (page) => page.endsWith("/") }),
  ],
  output: "static",
  // Self-hosted fonts through Astro's Fonts API: it writes the @font-face
  // rules, metric-matched fallbacks (no layout shift on swap) and preloads.
  // Files are the latin subsets from Fontsource, vendored in src/assets/fonts.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          { weight: "100 900", style: "normal", src: ["./src/assets/fonts/outfit-latin-wght-normal.woff2"] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Sora",
      cssVariable: "--font-sora",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          { weight: 400, style: "normal", src: ["./src/assets/fonts/sora-latin-400-normal.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/sora-latin-500-normal.woff2"] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["ui-monospace", "Courier New", "monospace"],
      options: {
        variants: [
          { weight: 400, style: "normal", src: ["./src/assets/fonts/jetbrains-mono-latin-400-normal.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/jetbrains-mono-latin-500-normal.woff2"] },
        ],
      },
    },
  ],
});


