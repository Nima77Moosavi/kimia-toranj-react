import React, { useEffect, useState } from "react";
import CollectionCard from "../CollectionCard/CollectionCard";
import styles from "./Collections.module.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1); // مقدار شروع: 1 برای حالت چرخشی
  const [isTransitioning, setIsTransitioning] = useState(true); // کنترل انیمیشن

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/store/collections/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        // برای ایجاد حالت چرخشی، یک کپی از اولین و آخرین آیتم اضافه می‌کنیم
        if (data.length > 0) {
          setCollections([data[data.length - 1], ...data, data[0]]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);

    // اگر به آخرین اسلاید واقعی رسیدیم، بدون انیمیشن به اولین اسلاید واقعی برگردیم
    setTimeout(() => {
      if (currentIndex >= collections.length - 2) {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }
    }, 500);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);

    // اگر به اولین اسلاید واقعی رسیدیم، بدون انیمیشن به آخرین اسلاید واقعی برگردیم
    setTimeout(() => {
      if (currentIndex <= 1) {
        setIsTransitioning(false);
        setCurrentIndex(collections.length - 2);
      }
    }, 500);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.collections}>
      <h2 className={styles.sectionTitle}>دسته بندی محصولات</h2>
      <div className={styles.sliderContainer}>
        <button className={styles.prevButton} onClick={handlePrev}>
          قبلی
        </button>
        <div className={styles.slider}>
          {collections.map((collection, index) => {
            let position = (index - currentIndex) * 30;
            let scale = index === currentIndex ? 1.2 : 0.8;
            let opacity = index === currentIndex ? 1 : 0.5;

            return (
              <div
                key={index}
                className={`${styles.slide} ${
                  index === currentIndex ? styles.active : ""
                }`}
                style={{
                  transform: `translateX(${position}%) scale(${scale})`,
                  opacity: opacity,
                  zIndex: index === currentIndex ? 10 : 5,
                  transition: isTransitioning ? "transform 0.5s ease, opacity 0.5s ease" : "none",
                }}
              >
                <CollectionCard collection={collection} />
              </div>
            );
          })}
        </div>
        <button className={styles.nextButton} onClick={handleNext}>
          بعدی
        </button>
      </div>
    </div>
  );
};

export default Collections;
