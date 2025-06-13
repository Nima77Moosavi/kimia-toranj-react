import React, { useState, useEffect } from "react";
import styles from "./SpecialProducts.module.css";
import ProductCard from "../ProductCard/ProductCard";
import { Link } from "react-router-dom";

const SpecialProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/store/products/"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setProducts(data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className={styles.loading}></div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  // Use the first 10 products from the API:
  const visibleProducts = products.slice(0, 10);

  return (
    <div className={styles.bestsellersContainer}>
      <Link to="/bestsellersPage" className={styles.link}>
        <h2 className={styles.title}>محصولات تخفیف دار</h2>
      </Link>
      <div className={styles.sliderWrapper}>
        <div className={styles.slider}>
          {visibleProducts.map((product) => (
            <div key={product.id} className={styles.slideItem}>
              <ProductCard product={product} />
            </div>
          ))}
          {/* Additional card that links to your Shop page */}
          {/* <div className={styles.slideItem}>
            <Link to="/shop" className={styles.shopLink}>
              مشاهده همه محصولات
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SpecialProducts;
