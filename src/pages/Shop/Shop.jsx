// src/pages/Shop/Shop.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
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

  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Ensure default filter is "all products" + default sort
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    let updated = false;

    if (!newParams.get("order_by")) {
      newParams.set("order_by", "price");
      updated = true;
    }
    if (newParams.has("collection")) {
      // remove collection filter for default
      newParams.delete("collection");
      updated = true;
    }

    if (updated) {
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  // Build query string with filters & paging
  const buildQuery = () => {
    const qs = searchParams.toString();
    return qs ? `?${qs}&page=${page}` : `?page=${page}`;
  };

  // Fetch products on filter or page change
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

  // Fetch collections once
  useEffect(() => {
    fetch(`${API_BASE}/collections/`)
      .then((r) => r.json())
      .then(setCollections)
      .catch(console.error);
  }, []);

  // Reset+apply a filter/sort
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

  // Filter & sort handlers
  const filterByCollection = (title) => applyFilter("collection", title);
  const filterAllProducts = () => applyFilter("collection", "all");
  const sortCheapest = () => applyFilter("order_by", "price");
  const sortExpensive = () => applyFilter("order_by", "-price");
  const sortNewest = () => applyFilter("order_by", "-created_at");

  // Infinite-scroll observer
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
            </div>
          )}
        </div>

        {/* Main */}
        <div className={styles.container}>
          <div className={styles.productContainer}>
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

            {loading && (
              <div className={styles.loading}>در حال بارگذاری...</div>
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
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shop;
