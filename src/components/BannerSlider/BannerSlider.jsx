import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "./BannerSlider.module.css";
import textImage from "../../assets/banner1.png";
import { API_URL } from "../../config";
import banner1 from "../../assets/banner11.png";
import banner2 from "../../assets/banner22.png";
import banner3 from "../../assets/banner33.png";

const BannerSlider = () => {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const banners = [{ image: banner1 }, { image: banner2 }, { image: banner3 }];

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((currentIndex - 1 + banners.length) % banners.length);
      setIsAnimating(false);
    }, 500);
  };

  const fetchPosts = async () => {
    const response = await axios.get(`${API_URL}api/blog/posts`);
    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {/* <div className={styles.topContainer}>
        <img src={image1} className={styles.logo} alt="کیمیا ترنج" />
      </div> */}
      <div className={styles.bottomContainer}>
        <div className={styles.rightContainer}>
          <div className={styles.logoContainer}>
            <img src={banner2} alt="کیمیا ترنج" className={styles.textImage} />
          </div>
          <div className={styles.logoContainer}>
            <img src={banner3} alt="کیمیا ترنج" className={styles.textImage} />
          </div>
        </div>
        <div className={styles.leftContainer}>
          <div className={styles.sliderContainer}>
            <div className={`${styles.prevButton} ${styles.navButton}`}>
              <GrFormPrevious className={styles.navIcon} onClick={prevSlide} />
            </div>
            <div className={styles.slider}>
              {banners.length > 0 && (
                <div
                  className={`${styles.sliderContent} ${
                    isAnimating ? styles.slideExit : ""
                  }`}
                >
                  <div className={styles.sliderImageContainer}>
                    <img
                      src={banners[currentIndex].image}
                      alt="کیمیا ترنج"
                      className={styles.sliderImage}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={`${styles.nextButton} ${styles.navButton}`}>
              <GrFormNext className={styles.navIcon} onClick={nextSlide} />
            </div>
          </div>
          <div className={styles.slideIndicator}>
            {banners.map((_, index) => (
              <span
                key={index}
                className={`${styles.indicatorDot} ${
                  index === currentIndex ? styles.active : ""
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerSlider;
