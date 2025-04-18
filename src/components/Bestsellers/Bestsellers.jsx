import React, { useState, useEffect, useRef } from "react";
import styles from "./Bestsellers.module.css";
import ProductCard from "../ProductCard/ProductCard";

const Bestsellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef();

  const itemsPerSlide = 5; // پنج محصول در هر اسلاید

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/store/products/");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto Play Logic (برای جابجایی یکی یکی محصولات)
  useEffect(() => {
    if (products.length === 0 || isHovered) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        // زمانی که به آخرین محصول رسیدیم به اولین محصول برمی‌گردیم
        return (prev + 1) % Math.max(products.length, itemsPerSlide);
      });
    }, 3000);

    return () => clearInterval(autoPlayRef.current);
  }, [products.length, isHovered]);

  // محاسبه محصولات قابل مشاهده
  const getVisibleProducts = () => {
    const startIndex = currentSlide;
    let visibleProducts = products.slice(startIndex, startIndex + itemsPerSlide);

    // اگر تعداد محصولات کمتر از itemsPerSlide باشد، از اول دوباره محصولات را اضافه کن
    if (visibleProducts.length < itemsPerSlide) {
      visibleProducts = [
        ...visibleProducts,
        ...products.slice(0, itemsPerSlide - visibleProducts.length)
      ];
    }

    return visibleProducts;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.bestsellersContainer}>
      <h2 className={styles.title}>محصولات پرفروش</h2>

      <div
        className={styles.sliderWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.slider}>
          {getVisibleProducts().map((product) => (
            <div key={product.id} className={styles.slideItem}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* نمایش نقاط به تعداد محصولات */}
      {products.length > 0 && (
        <div className={styles.dotsContainer}>
          {Array.from({ length: products.length }).map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                currentSlide === index ? styles.activeDot : ""
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`اسلاید ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bestsellers;
