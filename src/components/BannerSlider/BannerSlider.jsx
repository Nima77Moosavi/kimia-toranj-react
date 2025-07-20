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
  // 1) The real images
  const realSlides = useMemo(() => [banner1, banner2, banner3, banner4], []);

  // 2) Build clones at front/back
  const slides = useMemo(
    () => [
      realSlides[realSlides.length - 1], // last clone
      ...realSlides,
      realSlides[0], // first clone
    ],
    [realSlides]
  );

  // 3) State & refs
  const [idx, setIdx] = useState(1);
  const [anim, setAnim] = useState(true);
  const timeoutRef = useRef(null);

  const maxIndex = slides.length - 2; // last real slide
  const minIndex = 1; // first real slide

  // 4) Next / Prev handlers
  const nextSlide = () => {
    setIdx((i) => i + 1);
    setAnim(true);
  };
  const prevSlide = () => {
    setIdx((i) => i - 1);
    setAnim(true);
  };

  // 5) Snap when landing on a clone
  const onTransitionEnd = () => {
    if (idx > maxIndex) {
      // went past last real → snap to first real
      setAnim(false);
      setIdx(minIndex);
    }
    if (idx < minIndex) {
      // went before first real → snap to last real
      setAnim(false);
      setIdx(maxIndex);
    }
  };

  // 6) Re-enable animation after any snap
  useEffect(() => {
    if (!anim) {
      requestAnimationFrame(() => setAnim(true));
    }
  }, [anim]);

  // 7) Autoplay with per-slide timeout + clamp
  useEffect(() => {
    // Clamp idx into [minIndex, maxIndex]
    if (idx < minIndex) {
      setIdx(minIndex);
      return;
    }
    if (idx > maxIndex) {
      setIdx(minIndex);
      return;
    }

    // Clear previous timer
    clearTimeout(timeoutRef.current);

    // Schedule next slide in 3s
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 3000);

    // Cleanup
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [idx, minIndex, maxIndex]);

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.patternContainer}>
        <img src={patternImg} alt="" className={styles.patternImage} />
      </div>

      <div className={styles.sliderWindow}>
        {/* <button
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
