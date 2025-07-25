import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginSitemap } from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    VitePluginSitemap({
      hostname: 'https://kimiatoranj.com', // <-- Change to your real domain!
      routes: [
        '/', '/login', '/blog', '/shop', '/gift-selector'
        // Add dynamic routes below, e.g. /blog/1, /blog/2, etc.
      ],
    }),
  ],
  build: {
    outDir: "build",
  },
});