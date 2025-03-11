import React from "react";
import styles from "./ProductCard.module.css";
import logo from "../../assets/logo.png";

const ProductCard = ({ product }) => {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          src={
            product.images.length > 0
              ? `${product.images[0].image}`
              : "/placeholder.jpg"
          }
          alt={product.title}
          className={styles.image}
        />
        {/* Logo in the top-right corner */}
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      <div className={styles.title}>
        <p>{product.title}</p>
      </div>
      {/* Price with dark background */}
      <div className={styles.priceContainer}>
        <div className={styles.price}>
          تومان
          <span>
            {product.variants.length > 0
              ? `${product.variants[0].price}`
              : 1000000}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
