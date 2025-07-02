import React from "react";
import styles from "./SpecialOffer.module.css";
import img from "../../assets/special.png";

const SpecialOffer = () => {
  return (
    <div className={styles.container}>
      {/* Right side content: title, description, and buttons */}
      <div className={styles.rightDiv}>
        <h1 className={styles.title}>کاسه بشقاب لاله</h1>
        <p className={styles.description}>
          <span>کار فاخر و خاص</span>
          <span>جنس محصول برنج ضخیم</span>
          <span>قمزنی صورت با روکش قلع</span>
          <span>دور رنگ کارشده و تماما دست ساز</span>
          <span>دارای شناسنامه</span>
          <span>قطر بشقاب 50 سانتی متر دهانه کاسه 34 سانتی متر و ارتفاع 23 سانتی متر</span>
        </p>
        <div className={styles.priceContainer}>
          <button className={styles.price}>113,000,000 تومان</button>
          <button className={styles.addtocard}>افزودن به سبد خرید</button>
        </div>
      </div>
      {/* Left side: image and its decorative attributes */}
      <div className={styles.leftDiv}>
        <img src={img} alt="" className={styles.img} />
        <div className={styles.attrContainer}>
          <div className={styles.attr1}>قلم  صورت </div>
          <div className={styles.attr2}> قطر 50cm</div>
          <div className={styles.attr3}>نقش و نگار زیبا</div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
