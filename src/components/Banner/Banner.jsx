import React from "react";
import styles from "./Banner.module.css";
import baseImage from "../../assets/img.png";  // This is your left-side image
import textImage from "../../assets/banner1.png"; // This is your text overlay image

const Banner = () => {
  return (
    <div className={styles.container}>
      <img src={baseImage} alt="Background" className={styles.baseImg} />
      <img src={textImage} alt="Banner Text" className={styles.textImg} />
    </div>
  );
};

export default Banner;
