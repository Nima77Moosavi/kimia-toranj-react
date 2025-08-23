import React from "react";
import { AiOutlineSafety } from "react-icons/ai";
import { TbShieldStar } from "react-icons/tb";
import { MdOutlineReceiptLong } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";

import styles from "./PriceBox.module.css";
import { formatPrice } from "../../../utils/formatPrice";
import { Link } from "react-router-dom";

const PriceBox = ({ price, promotions = [], onAddToCart, stock }) => {
  const lowStock = stock > 0 && stock < 3;
  const outOfStock = stock === 0;

  const hasPromotion = promotions.length > 0 && promotions[0].discount;
  const discountPercent = hasPromotion ? promotions[0].discount : 0;
  const discountedPrice = hasPromotion
    ? Math.round(price * (1 - discountPercent / 100))
    : price;

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
          {hasPromotion ? (
            <div className={styles.priceWrapper}>
              <span className={styles.oldPrice}>
                {formatPrice(price)} تومان
              </span>
              <span className={styles.discountBadge}>
                {discountPercent}٪ تخفیف
              </span>
              <button className={styles.price}>
                {formatPrice(discountedPrice)} تومان
              </button>
            </div>
          ) : (
            <button className={styles.price}>
              {formatPrice(price)} تومان
            </button>
          )}

          <button
            className={styles.addToCart}
            onClick={onAddToCart}
            disabled={stock === 0}
          >
            افزودن به سبد خرید
          </button>

          <button className={styles.installmentPayment}>
            <Link
              to={`/installment-payment?price=${hasPromotion ? discountedPrice : price}`}
              className={styles.contactOption}
            >
              پرداخت اقساطی
              <MdOutlineReceiptLong
                className={styles.installmentPaymentIcon}
              />
            </Link>
          </button>
        </>
      )}
    </div>
  );
};

export default PriceBox;
