// src/components/BannerSlider/BannerSlider.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "./BannerSlider.module.css";

import banner1 from "../../assets/banner11.jpg";
import banner2 from "../../assets/banner22.jpg";
import banner3 from "../../assets/banner33.jpg";
import banner4 from "../../assets/banner44.jpg";
import patternImg from "../../assets/forground-banner.png";

const BannerSlider = () => {
  // 1) your real slides
  const realSlides = useMemo(() => [banner1, banner2, banner3, banner4], []);

  // 2) build infinite-track with clones
  const slides = useMemo(
    () => [
      realSlides[realSlides.length - 1], // clone of last
      ...realSlides,
      realSlides[0], // clone of first
    ],
    [realSlides]
  );

  // 3) state & refs
  const [idx, setIdx] = useState(1);
  const [anim, setAnim] = useState(true);
  const trackRef = useRef(null);
  const timeoutRef = useRef(null);

  // 4) advance & retreat
  const nextSlide = () => {
    setIdx((i) => i + 1);
    setAnim(true);
  };
  const prevSlide = () => {
    setIdx((i) => i - 1);
    setAnim(true);
  };

  // 5) snap when hitting a clone
  const onTransitionEnd = () => {
    if (idx === slides.length - 1) {
      setAnim(false);
      setIdx(1);
    }
    if (idx === 0) {
      setAnim(false);
      setIdx(slides.length - 2);
    }
  };

  // 6) re-enable animation immediately after a “snap”
  useEffect(() => {
    if (!anim) {
      requestAnimationFrame(() => setAnim(true));
    }
  }, [anim]);

  // 7) AUTOMATICALLY advance 3s after every slide
  useEffect(() => {
    // clear previous timer
    clearTimeout(timeoutRef.current);

    // schedule next slide
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 3000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [idx]);

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.patternContainer}>
        <img src={patternImg} alt="pattern" className={styles.patternImage} />
      </div>

      <div className={styles.sliderWindow}>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={prevSlide}
        >
          <GrFormPrevious />
        </button>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={nextSlide}
        >
          <GrFormNext />
        </button>

        <div className={styles.trackContainer}>
          <div
            ref={trackRef}
            className={styles.track}
            style={{
              transform: `translateX(-${idx * 100}%)`,
              transition: anim ? "transform 0.5s ease" : "none",
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {slides.map((src, i) => (
              <div key={i} className={styles.slide}>
                <img
                  src={src}
                  alt={`banner-${i}`}
                  className={styles.slideImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
