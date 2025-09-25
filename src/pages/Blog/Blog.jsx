// src/pages/Blog/Blog.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Blog.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const posts = [
  {
    id: 1,
    slug: "Enlivening-your-home-with-iranian-arts-and-crafts",
    title: "زنده کردن فضای خانه با هنر و صنایع دستی ایرانی",
    excerpt:
      "صنایع دستی ایرانی فقط یک شیء تزئینی نیستند؛ هر کدام یک سفیر فرهنگی‌اند که روح هنر و مهارت نسل‌های گذشته را به فضای زندگی امروزی منتقل می‌کنند. فروشگاه «کیمیا ترنج» با ارائه آثار اصیل اصفهان و شهرهای دیگر، فرصتی فراهم می‌کند تا خانه‌ها با اصالتی چشمگیر و کیفیت ماندگار تزئین شوند.",
    image: "/images/post2/khatam-esfahan.webp",
  },
  {
    id: 2,
    slug: "Isfahan-Handicrafts-A-lasting-legacy-from-the-heart-of-Iranian-history",
    title: "صنایع دستی اصفهان؛ میراثی ماندگار از دل تاریخ ایران",
    excerpt:
      "اصفهان، نگین درخشان فلات ایران، نه تنها به معماری بی‌نظیر و آثار تاریخی‌اش شهرت دارد، بلکه به عنوان مهد صنایع دستی ایران نیز شناخته می‌شود. صنایع دستی اصفهان ترکیبی از هنر، فرهنگ و تاریخ است که قرن‌هاست به زندگی مردم این سرزمین روح می‌بخشد. این هنرها تنها محصولی برای فروش یا تزئین نیستند، بلکه روایتگر هویت ملی و اصالت ایرانی‌اند. در این مقاله به بررسی ریشه‌ها، انواع، جایگاه جهانی و اهمیت صنایع دستی اصفهان می‌پردازیم و سپس به معرفی محصولات فروشگاه کیمیا ترنج مانند قاب، خاتم‌کاری، قلم‌زنی، سماور برنجی، پک هدیه سازمانی، محصولات برنجی، زرینه، شبه نقره و آینه شمعدان می‌پردازیم.",
    image: "/images/post2/qalamzani-esfahan.webp",
  },
  {
    id: 3,
    slug: "The-art-of-calligraphy-and-inlay-work-masterpieces-of-Isfahan-handicrafts",
    title: "هنر قلم‌زنی و خاتم‌کاری؛ شاهکارهای صنایع دستی اصفهان",
    excerpt:
      "اصفهان، نگین درخشان ایران، نه تنها به معماری و آثار تاریخی بی‌نظیرش معروف است، بلکه خاستگاه برخی از ارزشمندترین صنایع دستی ایران نیز محسوب می‌شود. در میان این هنرها، قلم‌زنی  و خاتم‌کاری جایگاه ویژه‌ای دارند و نمادی از ذوق، مهارت و تاریخ فرهنگی ایران هستند. این دو هنر با ترکیب ظرافت، صبر و دقت، آثار بی‌نظیری خلق می‌کنند که هم در ایران و هم در سطح جهانی شناخته شده‌اند. در این مقاله به بررسی تاریخچه، تکنیک‌ها، محصولات، کاربردها، جایگاه جهانی، چالش‌ها و فرصت‌های قلم‌زنی و خاتم‌کاری پرداخته می‌شود و نمونه‌هایی از محصولات فروشگاه کیمیا ترنج نیز معرفی می‌گردد.",
    image: "/images/post3/qalamzani-khatam-products-3.webp",
  },
];

const Blog = () => {
  return (
    <>
      <Header />
      <div className={styles.blogPage}>
        <h1 className={styles.title}>مقالات</h1>

        <div className={styles.list}>
          {posts.map((post) => (
            <Link
              to={`/post/${post.slug}`}
              key={post.id}
              className={styles.card}
            >
              <div className={styles.cardImageWrapper}>
                <img
                  src={post.image}
                  alt={post.title}
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
