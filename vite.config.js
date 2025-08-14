import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      // 1. Your live site URL
      hostname: "https://kimiatoranj.com",

      // 2. List all your routes here.
      //    Include static paths and any dynamic ones you can resolve at build time.
      // routes: ["/", "/login", "/blog", "/shop", "/gift-selector"],

      // 3. If you have dynamic pages (e.g. blog posts), enumerate them here
      dynamicRoutes: [
        "/",
        "/login",
        "/blog",
        "/shop",
        "/gift-selector",
        "/category/brass-samovar",
        "/category/mirror-candleholder",
        "/category/khatamkari",
        "/category/brass-products",
        "/category/organizational-gift-pack",
      ],

      // 4. Exclude any client-only or private routes
      exclude: ["/user-panel/*", "/login"],

      generateRobotsTxt: false,

      // Optional: changefreq and priority defaults
      defaults: {
        changefreq: "weekly",
        priority: 0.7,
      },

      outDir: "build",
    }),
  ],
  build: {
    outDir: "build",
  },
});
