import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdTrendingUp } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./SimilarProducts.module.css";

import { API_URL } from "../../config";

const SimilarProducts = ({ productId, title = "محصولات مشابه" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const sliderRef               = useRef(null);

  useEffect(() => {
    if (!productId) return;

    async function fetchSimilar() {
      try {
        const res = await fetch(
          `${API_URL}api/store/products/?similar_to=${productId}`
        );
        if (!res.ok) throw new Error("Network error");

        const { results } = await res.json();
        setProducts(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilar();
  }, [productId]);

  const slide = (dir) => {
    const wrapper = sliderRef.current;
    if (!wrapper) return;
    const slider = wrapper.querySelector(`.${styles.slider}`);
    const first = slider?.children[0];
    if (!first) return;

    const itemW = first.getBoundingClientRect().width;
    const gap   = parseFloat(getComputedStyle(slider).gap) || 0;

    wrapper.scrollBy({
      left: (itemW + gap) * dir,
      behavior: "smooth",
    });
  };

  if (loading) return <div className={styles.loading}>در حال بارگذاری…</div>;
  if (error)   return <div className={styles.error}>خطا: {error}</div>;
  if (!products.length) return null; // hide if no matches

  return (
    <div className={styles.bestsellersContainer}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
          <MdTrendingUp className={styles.icon} />
        </div>
        <Link to="/shop" className={styles.shopLink}>
          مشاهده همه محصولات
        </Link>
      </div>

      {/* ARROWS */}
      <button
        className={styles.arrowLeft}
        onClick={() => slide(1)}
        aria-label="قبلی"
      >
        <GrFormNext />
      </button>
      <button
        className={styles.arrowRight}
        onClick={() => slide(-1)}
        aria-label="بعدی"
      >
        <GrFormPrevious />
      </button>

      {/* SLIDER */}
      <div className={styles.sliderWrapper} ref={sliderRef}>
        <div className={styles.slider}>
          {products.map((product) => (
            <div key={product.id} className={styles.slideItem}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarProducts;
