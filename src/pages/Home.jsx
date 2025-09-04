import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/Header/Header";
import Highlights from "../components/Highlights/Highlights";
import Collections from "../components/Collections/Collections";
import axios from "axios";
import Bestsellers from "../components/Bestsellers/Bestsellers";
import SpecialOffer from "../components/SpecialOffer/SpecialOffer";
import SpecialProducts from "../components/SpecialProducts/SpecialProducts";
import Footer from "../components/Footer/Footer";
import BannerSlider from "../components/BannerSlider/BannerSlider";
import FeaturesLine from "../components/FeaturesLine/FeaturesLine";
import styles from "./Home.module.css";

import banner1 from "../assets/banner11.webp";

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get(
          "https://kimiatoranj-api.liara.run/api/store/products/"
        );
        // Normalize: ensure it's always an array
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.results)
          ? response.data.results
          : [];
        setLatestProducts(list);
      } catch (err) {
        console.error("Error fetching latest products:", err);
        setLatestProducts([]); // fallback to empty array
      }
    };
    fetchLatestProducts();
  }, []);

  // Safely build product schema
  const productSchema = (
    Array.isArray(latestProducts) ? latestProducts : []
  ).map((p) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.title,
    image: Array.isArray(p.images)
      ? p.images.map((img) => img.image).filter(Boolean)
      : [],
    description: p.description || "",
    sku: p.sku || String(p.id),
    offers: {
      "@type": "Offer",
      url: `https://kimiatoranj.com/product/${p.slug}-${p.id}`,
      priceCurrency: "IRR",
      price: p.variants?.[0]?.price || p.price || 0,
      availability:
        (p.variants?.[0]?.inventory ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(p.average_rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.average_rating,
            reviewCount: p.reviews_count || 1,
          },
        }
      : {}),
  }));

  return (
    <div className={styles.home}>
      <Helmet>
        <title>کیمیا ترنج | فروشگاه تخصصی محصولات هنری و تزئینی</title>
        <meta
          name="description"
          content="جدیدترین محصولات هنری، تزئینی و دست‌ساز را در کیمیا ترنج ببینید. ارسال سریع، کیفیت بالا، قیمت مناسب."
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="کیمیا ترنج | فروشگاه تخصصی محصولات هنری"
        />
        <meta
          property="og:description"
          content="جدیدترین محصولات هنری، تزئینی و دست‌ساز را در کیمیا ترنج ببینید."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kimiatoranj.com/" />
        <meta
          property="og:image"
          content="https://kimiatoranj.com/og-image.jpg"
        />
        <html lang="fa" />

        {/* ✅ Canonical tag */}
        <link rel="canonical" href="https://kimiatoranj.com/" />

        <link rel="preload" as="image" href={banner1} imagesizes="100vw" />

        {/* Store structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "کیمیا ترنج",
            image: "https://kimiatoranj.com/logo.png",
            "@id": "https://kimiatoranj.com/#store",
            url: "https://kimiatoranj.com",
            telephone: "+98-913-912-5951",
            address: {
              "@type": "PostalAddress",
              streetAddress: "میدان نقش جهان، بازار مسگر ها",
              addressLocality: "اصفهان",
              addressCountry: "IR",
            },
            openingHours: ["Mo-Sa 09:00-20:00"],
            sameAs: [
              "https://www.instagram.com/kimia.toranj/",
              "https://t.me/yourshop",
            ],
          })}
        </script>

        {/* Product structured data */}
        {productSchema.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(productSchema)}
          </script>
        )}
      </Helmet>

      <Header />

      <main className={styles.content}>
        <section aria-labelledby="sec-banners">
          <h2 id="sec-banners" className={styles.srOnly}>
            بنرهای اصلی
          </h2>
          <BannerSlider />
        </section>

        <section aria-labelledby="sec-highlights">
          <h2 id="sec-highlights" className={styles.srOnly}>
            ویژگی‌های فروشگاه
          </h2>
          <Highlights />
        </section>

        <section aria-labelledby="sec-collections">
          <h2 id="sec-collections" className={styles.srOnly}>
            مجموعه‌ها
          </h2>
          <Collections />
        </section>

        <section aria-labelledby="sec-bestsellers">
          <h2 id="sec-bestsellers" className={styles.srOnly}>
            پرفروش‌ترین‌ها
          </h2>
          <Bestsellers />
        </section>

        <section aria-labelledby="sec-special-offer">
          <h2 id="sec-special-offer" className={styles.srOnly}>
            پیشنهاد ویژه
          </h2>
          <SpecialOffer />
        </section>

        <section aria-labelledby="sec-special-products">
          <h2 id="sec-special-products" className={styles.srOnly}>
            محصولات منتخب
          </h2>
          <SpecialProducts />
        </section>
      </main>

      <FeaturesLine />
      <Footer />
    </div>
  );
};

export default Home;
