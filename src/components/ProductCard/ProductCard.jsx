import React from "react";
import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { toPersianDigits } from "../../utils/faDigits";

const ProductCard = ({ product }) => {
  const productLink = `/product/${product.url_title}-${product.id}`;
  const variant = product.variants[0] || {};
  const stock = variant.stock ?? 0;

  // Check if product has a promotion
  const hasPromotion = product.promotions && product.promotions.length > 0;
  const discountPercent = hasPromotion ? product.promotions[0].discount : 0;

  // Calculate discounted price if promotion exists
  const discountedPrice = hasPromotion
    ? Math.round(variant.price * (1 - discountPercent / 100))
    : variant.price;

  return (
    <Link
      to={productLink}
      className={styles.cardLink}
      aria-label={`مشاهده ${product.title}`}
    >
      <div className={styles.card}>
        <img
          src={
            product.images.length > 0
              ? product.images[0].image
              : "/placeholder.jpg"
          }
          alt={product.title}
          className={styles.img}
          loading="lazy"
          width="200"
          height="190"
        />

        <h2 className={styles.title}>{toPersianDigits(product.title)}</h2>

        {stock > 0 && stock < 4 && (
          <span className={styles.stock}>
            تنها {toPersianDigits(stock)} عدد در انبار باقی مانده
          </span>
        )}

        {stock > 0 ? (
          <div className={styles.priceWrapper}>
            {hasPromotion && (
              <>
                <span className={styles.oldPrice}>
                  {formatPrice(variant.price)} تومان
                </span>
                <span className={styles.discountBadge}>
                  {toPersianDigits(discountPercent)}٪ تخفیف
                </span>
              </>
            )}
            <button className={styles.price}>
              {formatPrice(discountedPrice)} تومان
            </button>
          </div>
        ) : (
          <button className={styles.callButton} disabled>
            تماس بگیرید
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
