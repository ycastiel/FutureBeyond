
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  srcDir: "./start",
  publicDir: "./recursos/publico",
  integrations: [react()],
});
