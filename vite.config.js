import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";
import fetch from "node-fetch"; // npm install node-fetch

export default defineConfig(async () => {
  // 1️⃣ Fetch all products from your API
  const products = await fetch("https://api.kimiatoranj.com/api/store/products/?page_size=1000")
    .then(res => res.json())
    .then(data => {
      // Adjust depending on your API shape
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.results)) return data.results; //
      return [];
    });

  // 2️⃣ Map them to your product URL pattern
  const productRoutes = products.map(
    p => `/product/${p.url_title}-${p.id}`
  );

  // 3️⃣ Return the config with static + dynamic routes
  return {
    plugins: [
      react(),
      Sitemap({
        hostname: "https://kimiatoranj.com",
        routes: [
          "/", 
          "/login",
          "/installment-payment",
          "/blog",
          "/faq",
          "/shop",
          "/gift-selector",
          "/category/brass-samovar",
          "/category/brass-products",
          "/category/silver-plated",
          "/category/golden-brass",
          "/category/qalamzani",
          "/category/mirror-candleholder",
          "/category/organizational-gift-pack",
          "/category/khatamkari",
          ...productRoutes // ✅ dynamic product URLs
        ],
        exclude: ["/user-panel/*", "/login"],
        generateRobotsTxt: false,
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
  };
});
