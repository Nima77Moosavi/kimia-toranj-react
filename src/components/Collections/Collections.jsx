import React, { useEffect, useState, useCallback, useRef } from "react";
import CollectionCard from "../CollectionCard/CollectionCard";
import styles from "./Collections.module.css";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleSlides, setVisibleSlides] = useState(5);
  const sliderRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleNext = useCallback(() => {
    if (isTransitioning || collections.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === collections.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  }, [collections.length, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || collections.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? collections.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  }, [collections.length, isTransitioning]);

  // توابع جدید برای هندل کردن Swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const threshold = 50; // حداقل فاصله برای تشخیص Swipe
    const diff = touchStartX - touchEndX;
    
    if (diff > threshold) {
      // Swipe به چپ
      handleNext();
    } else if (diff < -threshold) {
      // Swipe به راست
      handlePrev();
    }
    
    setTouchStartX(0);
    setTouchEndX(0);
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("https://kimiatoranj-api.liara.run/api/store/collections/");
        if (!response.ok) {
          throw new Error("مشکل در دریافت اطلاعات");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setCollections(data);
          setVisibleSlides(Math.min(7, data.length));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    if (collections.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [collections.length, handleNext]);

  const getSlideIndex = (offset) => {
    let newIndex = currentIndex + offset;
    if (newIndex < 0) return collections.length + newIndex;
    if (newIndex >= collections.length) return newIndex - collections.length;
    return newIndex;
  };

  const slidesPerSide = Math.floor(visibleSlides / 2);

  if (error) {
    return <div className={styles.error}>خطا: {error}</div>;
  }

  if (loading) {
    return <div className={styles.loading}></div>;
  }

  if (collections.length === 0) {
    return <div className={styles.empty}>هیچ کالکشنی یافت نشد.</div>;
  }

  return (
    <div className={styles.collections}>
      <h2 className={styles.sectionTitle}>دسته‌بندی محصولات</h2>
      <div className={styles.sliderContainer}>
        <button className={styles.prevButton} onClick={handlePrev} disabled={isTransitioning}>
          <GrFormPrevious />
        </button>

        <div
          ref={sliderRef}
          className={styles.slider}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* اسلایدهای سمت چپ */}
          {Array.from({ length: slidesPerSide }).map((_, i) => {
            const index = getSlideIndex(-(i + 1));
            const distance = i + 1;
            return (
              <div
                key={`left-${i}`}
                className={`${styles.slide} ${styles.slideLeft}`}
                style={{
                  transform: `translateX(${-80 * distance}%) scale(${1 - 0.15 * distance})`,
                  opacity: 1 - 0.3 * distance,
                  zIndex: 10 - distance,
                }}
              >
                {collections[index] && <CollectionCard collection={collections[index]} />}
              </div>
            );
          })}

          {/* اسلاید اصلی */}
          <div
            className={`${styles.slide} ${styles.active}`}
            style={{
              transform: "translateX(0) scale(1.1)",
              opacity: 1,
              zIndex: 20,
            }}
          >
            {collections[currentIndex] && <CollectionCard collection={collections[currentIndex]} />}
          </div>

          {/* اسلایدهای سمت راست */}
          {Array.from({ length: slidesPerSide }).map((_, i) => {
            const index = getSlideIndex(i + 1);
            const distance = i + 1;
            return (
              <div
                key={`right-${i}`}
                className={`${styles.slide} ${styles.slideRight}`}
                style={{
                  transform: `translateX(${80 * distance}%) scale(${1 - 0.15 * distance})`,
                  opacity: 1 - 0.3 * distance,
                  zIndex: 10 - distance,
                }}
              >
                {collections[index] && <CollectionCard collection={collections[index]} />}
              </div>
            );
          })}
        </div>

        <button className={styles.nextButton} onClick={handleNext} disabled={isTransitioning}>
          <GrFormNext />
        </button>
      </div>
    </div>
  );
};

export default Collections;