import React, { useState, useEffect, useRef } from "react";
import styles from "./Bestsellers.module.css";
import ProductCard from "../ProductCard/ProductCard";

const Bestsellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const itemsPerSlide = 5;
  const autoPlayRef = useRef();
  const sliderRef = useRef();

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

  // محاسبه تعداد اسلایدها
  const totalSlides = Math.ceil(products.length / itemsPerSlide);
  
  // تنظیم اسلاید وسط به عنوان پیش‌فرض
  useEffect(() => {
    if (products.length > 0) {
      const middleSlide = Math.floor(totalSlides / 2);
      setCurrentSlide(middleSlide);
    }
  }, [products.length, totalSlides]);

  // Auto Play Logic
  useEffect(() => {
    if (products.length === 0 || isHovered) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev >= totalSlides - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(autoPlayRef.current);
  }, [products.length, isHovered, totalSlides]);

  const getVisibleProducts = () => {
    const startIndex = currentSlide * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    return products.slice(startIndex, endIndex);
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
        ref={sliderRef}
      >
        <div className={styles.slider}>
          {getVisibleProducts().map((product) => (
            <div key={product.id} className={styles.slideItem}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
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
    </div>
  );
};

export default Bestsellers;