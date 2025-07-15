import React from "react";
import styles from "./ProductCard.module.css"; // فرض کنید این فایل CSS را دارید
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const ProductCard = ({ product }) => {
  const productLink = `/productDetails/${product.url_title}-${product.id}`;
  const stock = product.variants[0].stock;

  return (
    <Link to={productLink} className={styles.cardLink}>
      <div className={styles.card}>
        <img
          src={
            product.images.length > 0
              ? `${product.images[0].image}`
              : "/placeholder.jpg"
          }
          alt={product.title}
          className={styles.img}
        />
        <h4 className={styles.title}>{product.title}</h4>
        {stock < 4 && stock > 0 && (
          <span className={styles.stock}>
            تنها {stock} عدد در انبار باقی مانده
          </span>
        )}
        <button className={styles.price}>
          {formatPrice(product.variants[0].price)} تومان
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
