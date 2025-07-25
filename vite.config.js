import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      // 1. Your live site URL
      hostname: 'https://www.yoursite.com',

      // 2. List all your routes here. 
      //    Include static paths and any dynamic ones you can resolve at build time.
      routes: [
        '/',
        '/login',
        '/blog',
        '/shop',
        '/bestsellersPage',
        '/gift-selector'
      ],

      // 3. If you have dynamic pages (e.g. blog posts), enumerate them here
      dynamicRoutes: [
        '/blog/1',
        '/blog/2',
        // …map your posts or products by ID/slug
      ],

      // 4. Exclude any client-only or private routes
      exclude: [
        '/user-panel/*',
        '/login'
      ],

      // Optional: changefreq and priority defaults
      defaults: {
        changefreq: 'weekly',
        priority: 0.7
      }
    })
  ],
  build: {
    outDir: "build",
  },
});