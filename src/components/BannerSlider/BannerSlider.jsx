// src/components/BannerSlider/BannerSlider.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "./BannerSlider.module.css";

// Import only the first (LCP) banner synchronously
import banner1Jpg from "../../assets/banner11.jpg";

const BannerSlider = () => {
  // Load non-critical banners after mount (don’t compete with LCP)
  const [otherSlides, setOtherSlides] = useState([]); // array of JPG urls

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [b2, b3, b4] = await Promise.all([
          import("../../assets/banner22.jpg"),
          import("../../assets/banner33.jpg"),
          import("../../assets/banner44.jpg"),
        ]);
        if (!cancelled) {
          setOtherSlides([b2.default, b3.default, b4.default]);
        }
      } catch {
        if (!cancelled) setOtherSlides([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Real slides: first (eager) + others (deferred)
  const realSlides = useMemo(() => [banner1Jpg, ...otherSlides], [otherSlides]);

  // Build clones for infinite loop
  const slides = useMemo(() => {
    if (realSlides.length === 0) return [];
    return [realSlides[realSlides.length - 1], ...realSlides, realSlides[0]];
  }, [realSlides]);

  // State & refs
  const [idx, setIdx] = useState(1); // start at first real slide
  const [anim, setAnim] = useState(true);
  const timeoutRef = useRef(null);

  const maxIndex = slides.length - 2; // last real slide
  const minIndex = 1; // first real slide

  // Next / Prev handlers
  const nextSlide = () => {
    setIdx((i) => i + 1);
    setAnim(true);
  };
  const prevSlide = () => {
    setIdx((i) => i - 1);
    setAnim(true);
  };

  // Snap when landing on a clone
  const onTransitionEnd = () => {
    if (idx > maxIndex) {
      setAnim(false);
      setIdx(minIndex);
    }
    if (idx < minIndex) {
      setAnim(false);
      setIdx(maxIndex);
    }
  };

  // Re-enable animation after any snap
  useEffect(() => {
    if (!anim) {
      requestAnimationFrame(() => setAnim(true));
    }
  }, [anim]);

  // Autoplay with per-slide timeout + clamp
  useEffect(() => {
    if (slides.length === 0) return;

    if (idx < minIndex) {
      setIdx(minIndex);
      return;
    }
    if (idx > maxIndex) {
      setIdx(minIndex);
      return;
    }

    clearTimeout(timeoutRef.current);
    // small delay so first paint isn’t competing with timer
    timeoutRef.current = setTimeout(nextSlide, 3000);

    return () => clearTimeout(timeoutRef.current);
  }, [idx, minIndex, maxIndex, slides.length]);

  return (
    <div className={styles.bannerWrapper}>
      {/* Decorative foreground pattern as CSS background (ignored by LCP) */}
      <div className={styles.patternContainer} aria-hidden="true" />

      <div
        className={styles.sliderWindow}
        role="region"
        aria-roledescription="carousel"
        aria-label="بنرهای تبلیغاتی فروشگاه"
      >
        {/* Optional nav buttons
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={prevSlide}
          aria-label="بنر قبلی"
        >
          ‹
        </button>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={nextSlide}
          aria-label="بنر بعدی"
        >
          ›
        </button> */}

        <div className={styles.trackContainer}>
          <div
            className={styles.track}
            style={{
              transform: `translateX(-${idx * 100}%)`,
              transition: anim ? "transform 0.5s ease" : "none",
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {slides.map((src, i) => {
              const isFirstRealSlide = i === 1; // first non-clone
              return (
                <div key={i} className={styles.slide}>
                  <img
                    src={src}
                    alt={`بنر شماره ${i}`}
                    className={styles.slideImage}
                    loading={isFirstRealSlide ? "eager" : "lazy"}
                    fetchpriority={isFirstRealSlide ? "high" : "auto"}
                    decoding="async"
                    width="1920"
                    height="600"
                    sizes="100vw"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
