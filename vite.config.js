// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: "https://www.yoursite.com",
      routes: [
        /* … */
      ],
      dynamicRoutes: [
        /* … */
      ],
      exclude: [
        /* … */
      ],
      generateRobotsTxt: false,
      defaults: { changefreq: "weekly", priority: 0.7 },

      // Tell it to look in `build/` instead of `dist/`
      outDir: "build",
    }),
  ],
  build: {
    outDir: "build",
  },
});
