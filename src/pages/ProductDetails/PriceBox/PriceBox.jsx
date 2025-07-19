// src/components/PriceBox/PriceBox.jsx
import React from "react";
import { AiOutlineSafety } from "react-icons/ai";
import { TbShieldStar } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";

import styles from "./PriceBox.module.css";

import { formatPrice } from "../../../utils/formatPrice";

const PriceBox = ({ price, onAddToCart, stock }) => {
  const lowStock = stock < 3;

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

      {/* ← ONLY THIS BLOCK CHANGED */}
      <p className={lowStock ? styles.inventory : ""}>
        {lowStock
          ? `تنها ${stock} عدد باقی مانده `
          : `${stock} عدد باقی مانده `}
        <BsBoxSeam className={styles.icon} />
      </p>

      <button className={styles.price}>{formatPrice(price)} تومان</button>
      <button className={styles.addToCart} onClick={onAddToCart}>
        افزودن به سبد خرید
      </button>
    </div>
  );
};

export default PriceBox;
