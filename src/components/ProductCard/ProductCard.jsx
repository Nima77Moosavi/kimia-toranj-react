// src/components/ProductCard/ProductCard.jsx

import React from "react";
import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const ProductCard = ({ product }) => {
  const productLink = `/product/${product.url_title}-${product.id}`;
  const variant = product.variants[0] || {};
  const stock = variant.stock ?? 0;

  return (
    <Link to={productLink} className={styles.cardLink}>
      <div className={styles.card}>
        <img
          src={
            product.images.length > 0
              ? product.images[0].image
              : "/placeholder.jpg"
          }
          alt={product.title}
          className={styles.img}
        />
        <h4 className={styles.title}>{product.title}</h4>

        {stock > 0 && stock < 4 && (
          <span className={styles.stock}>
            تنها {stock} عدد در انبار باقی مانده
          </span>
        )}

        {stock > 0 ? (
          <button className={styles.price}>
            {formatPrice(variant.price)} تومان
          </button>
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
