import React from "react";
import styles from "./SpecialOffer.module.css";
import img from "../../assets/special.png";

const SpecialOffer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.rightDiv}>
        <h1 className={styles.title}>آجیل خوری قلمزنی طرح نقره</h1>
        <p className={styles.description}>
          دکوری زیبا با روکش قلع و قلم صورت ظریف از جنس برنج هنر ارزشمند و
          دستساز و خاص دارای قابلیت سرمایه گذاری و دارای شناسنامه تمامی فرایند
          ساخت محصول دست ساز بوده جنس زیر کار برنج هست و در نهایت روکش قلع شده.{" "}
          <span>ارتفاع 23cm , دهانه 34cm</span>
        </p>
        <div className={styles.priceContainer}>
          <button className={styles.price}>3150000 تومان</button>
          <button className={styles.addtocard}>افزودن به سبد خرید</button>
        </div>
      </div>
      <div className={styles.leftDiv}>
        <img src={img} alt="" className={styles.img} />
        <div class={styles.attrContainer}>
          <div className={styles.attr1}>قلم گل و بلبل</div>
          <div className={styles.attr2}>سایز 50 * 70</div>
          <div className={styles.attr3}>نقش و نگار زیبا</div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
