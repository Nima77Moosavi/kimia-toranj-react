import React from "react";
import styles from "./ProductList.module.css";

const BASE_URL = "http://127.0.0.1:8000"; // Ensure you set the correct backend URL

const ProductList = ({ products }) => {
  return (
    <div className={styles.productList}>
      {products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <img
            src={
              product.images.length > 0
                ? `${product.images[0].image}`
                : "/placeholder.jpg"
            }
            alt={product.title}
            className={styles.image}
          />
          <h4 className={styles.title}>{product.title}</h4>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
