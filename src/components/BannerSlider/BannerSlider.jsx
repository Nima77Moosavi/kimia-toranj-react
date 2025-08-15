import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "./BannerSlider.module.css";

import banner1Jpg from "../../assets/banner11.jpg";
import patternImg from "../../assets/forground-banner.png"; // ✅ import here

const BannerSlider = () => {
  const [otherSlides, setOtherSlides] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [b2, b3, b4] = await Promise.all([
          import("../../assets/banner22.jpg"),
          import("../../assets/banner33.jpg"),
          import("../../assets/banner44.jpg"),
        ]);
        if (!cancelled) setOtherSlides([b2.default, b3.default, b4.default]);
      } catch {
        if (!cancelled) setOtherSlides([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const realSlides = useMemo(() => [banner1Jpg, ...otherSlides], [otherSlides]);
  const slides = useMemo(() => {
    if (!realSlides.length) return [];
    return [realSlides[realSlides.length - 1], ...realSlides, realSlides[0]];
  }, [realSlides]);

  const [idx, setIdx] = useState(1);
  const [anim, setAnim] = useState(true);
  const timeoutRef = useRef(null);

  const maxIndex = slides.length - 2;
  const minIndex = 1;

  const nextSlide = () => { setIdx(i => i + 1); setAnim(true); };
  const prevSlide = () => { setIdx(i => i - 1); setAnim(true); };

  const onTransitionEnd = () => {
    if (idx > maxIndex) { setAnim(false); setIdx(minIndex); }
    if (idx < minIndex) { setAnim(false); setIdx(maxIndex); }
  };

  useEffect(() => {
    if (!anim) requestAnimationFrame(() => setAnim(true));
  }, [anim]);

  useEffect(() => {
    if (!slides.length) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [idx, slides.length]);

  return (
    <div className={styles.bannerWrapper}>
      {/* Decorative foreground pattern */}
      <div
        className={styles.patternContainer}
        aria-hidden="true"
        style={{ backgroundImage: `url(${patternImg})` }} // ✅ safe background
      />

      <div
        className={styles.sliderWindow}
        role="region"
        aria-roledescription="carousel"
        aria-label="بنرهای تبلیغاتی فروشگاه"
      >
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
              const isFirstRealSlide = i === 1;
              return (
                <div key={i} className={styles.slide}>
                  <img
                    src={src}
                    alt={`بنر شماره ${i}`}
                    className={styles.slideImage}
                    loading={isFirstRealSlide ? "eager" : "lazy"}
                    fetchPriority={isFirstRealSlide ? "high" : "auto"}
                    decoding="async"
                    width="1280"
                    height="284"
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
