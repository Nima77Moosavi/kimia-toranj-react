// src/pages/Shop/Shop.jsx

// react imports
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// components import
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";

// third party components import
import { Range } from "react-range";

// import styles
import styles from "./Shop.module.css";

const API_BASE = "https://api.kimiatoranj.com/api/store";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);

  const pricePoints = [
    0, 1000000, 2000000, 3000000, 4000000, 5000000, 10000000, 15000000,
    20000000, 30000000, 40000000, 50000000, 100000000, 150000000,
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  // Ensure default sort
  useEffect(() => {
    if (!searchParams.get("order_by")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("order_by", "price");
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  // Build query string
  const buildQuery = () => {
    const qs = searchParams.toString();
    return qs ? `?${qs}&page=${page}` : `?page=${page}`;
  };

  // Fetch products
  useEffect(() => {
    let active = true;
    const abort = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${buildQuery()}`, {
          signal: abort.signal,
        });
        if (!res.ok) {
          if (res.status === 404) {
            if (active) setHasMore(false);
            return;
          }
          throw new Error("مشکل در دریافت محصولات");
        }
        const data = await res.json();
        if (!active) return;

        setProducts((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setHasMore(data.next !== null);
      } catch (err) {
        if (active && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
      abort.abort();
    };
  }, [searchParams, page]);

  // Fetch collections
  useEffect(() => {
    fetch(`${API_BASE}/collections/`)
      .then((r) => r.json())
      .then(setCollections)
      .catch(console.error);
  }, []);

  // Apply filter
  const applyFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (key === "collection" && value === "all") {
      newParams.delete("collection");
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setShowFilters(false);
  };

  // Apply price filter
  const applyPriceFilter = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("min_price", min);
    newParams.set("max_price", max);
    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setShowFilters(false);
  };

  // Filter & sort handlers
  const filterByCollection = (title) => applyFilter("collection", title);
  const filterAllProducts = () => applyFilter("collection", "all");
  const sortCheapest = () => applyFilter("order_by", "price");
  const sortExpensive = () => applyFilter("order_by", "-price");
  const sortNewest = () => applyFilter("order_by", "-created_at");

  // Infinite scroll
  const observer = useRef();
  const lastRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Price range JSX (shared)
  const PriceRangeSlider = (
    <div className={styles.priceRange}>
      <h2 className={styles.priceRangeTitle}>فیلتر بر اساس قیمت</h2>

      {/* Min Price Slider */}
      <label className={styles.sliderLabel}>
        حداقل قیمت: <span>{minPrice.toLocaleString()} تومان</span>
      </label>
      <input
        type="range"
        min="0"
        max="50000000"
        step="50000"
        value={minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value))}
        className={styles.slider}
      />

      {/* Max Price Slider */}
      <label className={styles.sliderLabel}>
        حداکثر قیمت: <span>{maxPrice.toLocaleString()} تومان</span>
      </label>
      <input
        type="range"
        min="0"
        max="50000000"
        step="50000"
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className={styles.slider}
      />

      <button
        className={styles.applyButton}
        onClick={() => applyPriceFilter(minPrice, maxPrice)}
      >
        اعمال فیلتر
      </button>
    </div>
  );

  return (
    <>
      <Header />
      <div className={styles.circle}></div>

      <div className={styles.content}>
        <h2 className={styles.title}>فروشگاه</h2>

        {/* Mobile filters */}
        <div className={styles.filterDropdownMobile}>
          <button
            className={styles.filterToggleButton}
            onClick={() => setShowFilters((s) => !s)}
          >
            {showFilters ? "بستن فیلتر" : "فیلتر و دسته بندی"}
          </button>
          {showFilters && (
            <div className={styles.dropdownFilters}>
              <div className={styles.collections}>
                <h2 className={styles.collectionsTitle}>
                  فیلتر بر اساس مجموعه
                </h2>
                <p
                  onClick={filterAllProducts}
                  className={styles.collectionFilter}
                >
                  همه محصولات
                </p>
                {collections.map((c) => (
                  <p
                    key={c.id}
                    onClick={() => filterByCollection(c.title)}
                    className={styles.collectionFilter}
                  >
                    {c.title}
                  </p>
                ))}
              </div>

              <div className={styles.sort}>
                <h2 className={styles.sortTitle}>مرتب کردن بر اساس</h2>
                <p onClick={sortCheapest} className={styles.sortOption}>
                  ارزان‌ترین
                </p>
                <p onClick={sortExpensive} className={styles.sortOption}>
                  گران‌ترین
                </p>
                <p onClick={sortNewest} className={styles.sortOption}>
                  جدیدترین
                </p>
              </div>

              {PriceRangeSlider}
            </div>
          )}
        </div>

        {/* Main */}
        <div className={styles.container}>
          <div className={styles.productContainer}>
            {/* Render products */}
            {products.map((product, i) => {
              const isLast = i === products.length - 1;
              return (
                <div
                  key={product.id}
                  ref={isLast ? lastRef : null}
                  className={styles.productWrapper}
                >
                  <ProductCard product={product} />
                </div>
              );
            })}

            {/* Initial load skeletons */}
            {loading && products.length === 0 && (
              <>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={styles.productWrapper}>
                    <div className={styles.cardSkeleton}>
                      <div
                        className={`${styles.skelImage} ${styles.skeleton}`}
                      />
                      <div
                        className={`${styles.skelLine} ${styles.skeleton}`}
                      />
                      <div
                        className={`${styles.skelLine} ${styles.skelLineShort} ${styles.skeleton}`}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Infinite scroll skeletons */}
            {loading && products.length > 0 && (
              <>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`more-${i}`} className={styles.productWrapper}>
                    <div className={styles.cardSkeleton}>
                      <div
                        className={`${styles.skelImage} ${styles.skeleton}`}
                      />
                      <div
                        className={`${styles.skelLine} ${styles.skeleton}`}
                      />
                      <div
                        className={`${styles.skelLine} ${styles.skelLineShort} ${styles.skeleton}`}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {error && <div className={styles.error}>خطا: {error}</div>}
            {!loading && products.length === 0 && (
              <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
            )}
            {!loading && !hasMore && products.length > 0 && (
              <div className={styles.endMessage}>
                هیچ محصول بیشتری موجود نیست
              </div>
            )}
          </div>

          {/* Sidebar (desktop) */}
          <aside className={styles.sidebarContainer}>
            <div className={styles.sidebarInner}>
              <div className={styles.collections}>
                <h2 className={styles.collectionsTitle}>
                  فیلتر بر اساس مجموعه
                </h2>
                <p
                  onClick={filterAllProducts}
                  className={styles.collectionFilter}
                >
                  همه محصولات
                </p>
                {collections.map((c) => (
                  <p
                    key={c.id}
                    onClick={() => filterByCollection(c.title)}
                    className={styles.collectionFilter}
                  >
                    {c.title}
                  </p>
                ))}
              </div>

              <div className={styles.sort}>
                <h2 className={styles.sortTitle}>مرتب کردن بر اساس</h2>
                <p onClick={sortCheapest} className={styles.sortOption}>
                  ارزان‌ترین
                </p>
                <p onClick={sortExpensive} className={styles.sortOption}>
                  گران‌ترین
                </p>
                <p onClick={sortNewest} className={styles.sortOption}>
                  جدیدترین
                </p>
              </div>

              {/* ✅ Price Range Filter for desktop */}
              {PriceRangeSlider}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shop;
