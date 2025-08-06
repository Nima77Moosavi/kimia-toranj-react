import React from "react";
import { AiOutlineSafety } from "react-icons/ai";
import { TbShieldStar } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";

import styles from "./PriceBox.module.css";
import { formatPrice } from "../../../utils/formatPrice";

const PriceBox = ({ price, onAddToCart, stock }) => {
  const lowStock = stock > 0 && stock < 3;
  const outOfStock = stock === 0;

  return (
    <div className={styles.priceContainer}>
      <p>
        بازگشت محصول تا 7 روز طبق شرایط مرجوعی
        <AiOutlineSafety className={styles.icon} />
      </p>
      <p>
        گارانتی ضمانت اصالت و سلامت فیزیکی کالا
        <TbShieldStar className={styles.icon} />
      </p>

      <p className={lowStock ? styles.inventory : ""}>
        {stock} عدد باقی مانده
        <BsBoxSeam className={styles.icon} />
      </p>

      {outOfStock ? (
        <button className={styles.callButton} disabled>
          <a
            href="https://wa.me/989130095238"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.contactOption} ${styles.option2}`}
          >
            تماس بگیرید
          </a>
        </button>
      ) : (
        <>
          <button className={styles.price}>{formatPrice(price)} تومان</button>
          <button
            className={styles.addToCart}
            onClick={onAddToCart}
            disabled={stock === 0}
          >
            افزودن به سبد خرید
          </button>
        </>
      )}
    </div>
  );
};

export default PriceBox;
