import React, { useEffect, useState, useCallback } from "react";
import CollectionCard from "../CollectionCard/CollectionCard";
import styles from "./Collections.module.css";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleSlides, setVisibleSlides] = useState(5);

  // تابع برای حرکت به اسلاید بعدی
  const handleNext = useCallback(() => {
    if (isTransitioning || collections.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === collections.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 600); // مدت زمان transition
  }, [collections.length, isTransitioning]);

  // تابع برای حرکت به اسلاید قبلی
  const handlePrev = useCallback(() => {
    if (isTransitioning || collections.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? collections.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 600); // مدت زمان transition
  }, [collections.length, isTransitioning]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/store/collections/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        if (data.length > 0) {
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

  // تنظیم تایمر برای حرکت خودکار
  useEffect(() => {
    if (collections.length <= 1) return; // اگر فقط یک اسلاید داریم نیازی به تایمر نیست
    
    const timer = setInterval(() => {
      handleNext();
    }, 2000); // هر 2 ثانیه

    return () => clearInterval(timer); // پاک کردن تایمر هنگام unmount
  }, [collections.length, handleNext]);

  const getSlideIndex = (offset) => {
    let newIndex = currentIndex + offset;
    if (newIndex < 0) return collections.length + newIndex;
    if (newIndex >= collections.length) return newIndex - collections.length;
    return newIndex;
  };

  const slidesPerSide = Math.floor(visibleSlides / 2);

  // if (loading) {
  //   return <div className={styles.loading}>Loading...</div>;
  // }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (collections.length === 0) {
    return <div className={styles.empty}>No collections found</div>;
  }

  return (
    <div className={styles.collections}>
      <h2 className={styles.sectionTitle}>دسته بندی محصولات</h2>
      <div className={styles.sliderContainer}>
        <button 
          className={styles.prevButton} 
          onClick={handlePrev}
          disabled={isTransitioning}
        >
          <GrFormPrevious />
        </button>
        <div className={styles.slider}>
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
                  opacity: 1 - (0.3 * distance),
                  zIndex: 10 - distance,
                }}
              >
                <CollectionCard collection={collections[index]} />
              </div>
            );
          })}

          {/* اسلاید فعلی */}
          <div
            className={`${styles.slide} ${styles.active}`}
            style={{
              transform: 'translateX(0) scale(1.1)',
              opacity: 1,
              zIndex: 20,
            }}
          >
            <CollectionCard collection={collections[currentIndex]} />
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
                  opacity: 1 - (0.3 * distance),
                  zIndex: 10 - distance,
                }}
              >
                <CollectionCard collection={collections[index]} />
              </div>
            );
          })}
        </div>
        <button 
          className={styles.nextButton} 
          onClick={handleNext}
          disabled={isTransitioning}
        >
          <GrFormNext />
        </button>
      </div>
    </div>
  );
};

export default Collections;