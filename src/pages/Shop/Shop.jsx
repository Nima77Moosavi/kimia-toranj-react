import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Shop.module.css";

const API_BASE = "https://kimiatoranj-api.liara.run/api/store";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // Ensure we always have an order_by param by default
  useEffect(() => {
    if (!searchParams.get("order_by")) {
      const newP = new URLSearchParams(searchParams);
      newP.set("order_by", "price");
      setSearchParams(newP, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  // Build the query string for current filters & page
  const buildQuery = () => {
    const qs = searchParams.toString();
    return qs ? `?${qs}&page=${page}` : `?page=${page}`;
  };

  // Fetch products whenever searchParams or page changes
  useEffect(() => {
    let isActive = true;
    const aborter = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/products/${buildQuery()}`, {
          signal: aborter.signal,
        });
        if (!res.ok) {
          if (res.status === 404) {
            // no more pages
            if (isActive) setHasMore(false);
            return;
          }
          throw new Error("مشکل در دریافت محصولات");
        }
        const data = await res.json();
        if (!isActive) return; // ignore if unmounted/aborted

        // Append or replace based on page
        setProducts((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setHasMore(data.next !== null);
      } catch (err) {
        if (isActive && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    load();

    return () => {
      isActive = false;
      aborter.abort();
    };
  }, [searchParams, page]);

  // Load collections once
  useEffect(() => {
    fetch(`${API_BASE}/collections/`)
      .then((r) => r.json())
      .then(setCollections)
      .catch(console.error);
  }, []);

  // Common reset logic when applying a new filter/sort
  const applyFilter = (key, value) => {
    const newP = new URLSearchParams(searchParams);
    newP.set(key, value);

    setSearchParams(newP);
    setProducts([]); // clear old
    setPage(1); // start from first page
    setHasMore(true); // reset paging
    setShowFilters(false);
  };

  // Handlers
  const filterByCollection = (title) => applyFilter("collection", title);
  const sortCheapest = () => applyFilter("order_by", "price");
  const sortExpensive = () => applyFilter("order_by", "-price");

  // IntersectionObserver for infinite scroll
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

        {/* Mobile filter toggle */}
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
              </div>
            </div>
          )}
        </div>

        {/* Main Area */}
        <div className={styles.container}>
          {/* Grid of products */}
          <div className={styles.productContainer}>
            {products.map((product, idx) => {
              const isLast = idx === products.length - 1;
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

          {/* Desktop Sidebar */}
          <aside className={styles.sidebarContainer}>
            <div className={styles.sidebarInner}>
              <div className={styles.collections}>
                <h2 className={styles.collectionsTitle}>
                  فیلتر بر اساس مجموعه
                </h2>
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
