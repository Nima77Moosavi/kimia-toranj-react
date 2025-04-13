import React, { useState, useEffect } from "react";
import styles from "./Bestsellers.module.css";
import ProductCard from "../ProductCard/ProductCard";

const Bestsellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3; // تعداد آیتم‌هایی که میخواهیم در یک زمان نمایش داده شود

  // گرفتن محصولات از API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/store/products/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data); // ذخیره محصولات در state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // نمایش حالت لودینگ یا خطا
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // حرکت به اسلاید بعدی
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow >= products.length
        ? 0 // اگر به آخرین اسلاید رسیدیم، از ابتدا شروع کنیم
        : prevIndex + itemsToShow
    );
  };

  // حرکت به اسلاید قبلی
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsToShow < 0
        ? products.length - itemsToShow // اگر به اولین اسلاید رسیدیم، به آخرین اسلاید برویم
        : prevIndex - itemsToShow
    );
  };

  return (
    <div className={styles.bestsellersContainer}>
      <h2 className={styles.title}>محصولات پرفروش</h2>
      <div className={styles.sliderContainer}>
        <button className={styles.prevButton} onClick={handlePrev}>
          قبلی
        </button>
        <div className={styles.slider}>
          {products
            .slice(currentIndex, currentIndex + itemsToShow)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
        <button className={styles.nextButton} onClick={handleNext}>
          بعدی
        </button>
      </div>
    </div>
  );
};

export default Bestsellers;
