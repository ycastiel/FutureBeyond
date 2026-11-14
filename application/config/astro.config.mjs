import { defineConfig } from "astro/config";

export default defineConfig({
  srcDir: "../frontend",
  publicDir: "../frontend/recursos/publico",
  outDir: "./start/dist",

  // Cache do Astro
  cacheDir: "../node_modules/.astro",

  // Cache do Vite
  vite: {
    cacheDir: "../node_modules/.vite",
  },
});
