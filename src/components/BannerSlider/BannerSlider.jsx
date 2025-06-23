import React, { useState, useRef, useEffect } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "./BannerSlider.module.css";

import banner1 from "../../assets/banner11.jpg";
import banner2 from "../../assets/banner23.jpg";
import banner3 from "../../assets/banner33.png";
import patternImg from "../../assets/forground-banner.png";

const BannerSlider = () => {
  const realSlides = [banner1, banner2, banner3];

  // build extended slides: [last, ...real, first]
  const slides = [
    realSlides[realSlides.length - 1],
    ...realSlides,
    realSlides[0],
  ];

  // start at index=1 (the first real slide)
  const [idx, setIdx] = useState(1);
  const [animate, setAnimate] = useState(true);
  const trackRef = useRef(null);

  // Move track
  const shift = (newIdx) => {
    setIdx(newIdx);
    setAnimate(true);
  };

  const next = () => shift(idx + 1);
  const prev = () => shift(idx - 1);

  // On transition end, if we hit a clone, snap back
  const onTransitionEnd = () => {
    // hit the right‐most clone?
    if (idx === slides.length - 1) {
      setAnimate(false);
      setIdx(1);
    }
    // hit the left‐most clone?
    if (idx === 0) {
      setAnimate(false);
      setIdx(slides.length - 2);
    }
  };

  // re-enable animation after a snap
  useEffect(() => {
    if (!animate) {
      // next tick, turn it back on
      requestAnimationFrame(() => setAnimate(true));
    }
  }, [animate]);

  return (
    <div className={styles.bannerWrapper}>
      {/* Left pattern */}
      <div className={styles.patternContainer}>
        <img
          src={patternImg}
          alt="صنایع‌دستی"
          className={styles.patternImage}
        />
      </div>

      {/* Slider */}
      <div className={styles.sliderWindow}>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={next}
        >
          <GrFormNext />
        </button>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={next}
        >
          <GrFormPrevious />
        </button>

        <div className={styles.trackContainer}>
          <div
            ref={trackRef}
            className={styles.track}
            style={{
              transform: `translateX(-${idx * 100}%)`,
              transition: animate ? "transform 0.5s ease" : "none",
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
