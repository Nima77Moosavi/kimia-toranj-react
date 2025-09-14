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
    image: "/images/qalamzani.webp",
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
