import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Shop.module.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Get and update query parameters.
  const [searchParams, setSearchParams] = useSearchParams();

  // Automatically set a default ordering (cheapest first) if not set.
  useEffect(() => {
    if (!searchParams.get("order_by")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("order_by", "price");
      setSearchParams(newParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: build query string from searchParams and current page.
  const buildQueryString = () => {
    const qs = searchParams.toString();
    // Append page query parameter once you want to support pagination
    return qs ? `?${qs}&page=${page}` : `?page=${page}`;
  };

  // Fetch products when search parameters or page changes.
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = buildQueryString();
        const response = await fetch(
          `https://kimiatoranj-api.liara.run/api/store/products/${query}`
        );
        if (!response.ok) throw new Error("مشکل در دریافت محصولات");
        const data = await response.json();

        // Assuming `data.results` contains the list of products for this page
        // and that you can detect if there are more products via data.next or number of results.
        if (page === 1) {
          setProducts(data.results);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.results]);
        }

        // If API supplies a next page indicator or returns fewer items than expected,
        // then mark hasMore to false.
        data.results.length === 0 ? setHasMore(false) : setHasMore(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, page]);

  // Fetch collections for filtering (only once).
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/store/collections/"
        );
        if (!response.ok) throw new Error("مشکل در دریافت مجموعه‌ها");
        const data = await response.json();
        setCollections(data);
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
    };
    fetchCollections();
  }, []);

  // When filtering by collection, update the query parameters and reset the product list.
  const filterByCollection = (collectionTitle) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("collection", collectionTitle);
    setSearchParams(newParams);
    // Reset the product list pagination.
    setProducts([]);
    setPage(1);
    setShowFilters(false);
  };

  // Handlers for sorting.
  const sortCheapest = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", "price");
    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setShowFilters(false);
  };

  const sortExpensive = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", "-price");
    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setShowFilters(false);
  };

  // Intersection Observer for lazy loading.
  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect(); // remove previous observer instance
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.title}>فروشگاه</h2>
        <div className={styles.filterDropdownMobile}>
          <button
            className={styles.filterToggleButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "بستن فیلتر" : "فیلترها"}
          </button>
          {showFilters && (
            <div className={styles.dropdownFilters}>
              <div className={styles.collections}>
                <h2 className={styles.collectionsTitle}>
                  فیلتر بر اساس مجموعه
                </h2>
                {collections.map((collection) => (
                  <p
                    key={collection.id}
                    onClick={() => filterByCollection(collection.title)}
                    className={styles.collectionFilter}
                  >
                    {collection.title}
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
        <div className={styles.container}>
          <div className={styles.productContainer}>
            {products.map((product, index) => {
              // Attach the ref to the last element so we can trigger lazy loading.
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductElementRef} key={product.id}>
                    <ProductCard product={product} />
                  </div>
                );
              } else {
                return <ProductCard product={product} key={product.id} />;
              }
            })}
            {loading && (
              <div className={styles.loading}>در حال بارگذاری...</div>
            )}
            {error && <div className={styles.error}>خطا: {error}</div>}
            {!loading && products.length === 0 && (
              <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
            )}
          </div>

          {/* Desktop sidebar for filters */}
          <div className={styles.sidebarContainer}>
            <div className={styles.sidebarInner}>
              <div className={styles.collections}>
                <h2 className={styles.collectionsTitle}>
                  فیلتر بر اساس مجموعه
                </h2>
                {collections.map((collection) => (
                  <p
                    key={collection.id}
                    onClick={() => filterByCollection(collection.title)}
                    className={styles.collectionFilter}
                  >
                    {collection.title}
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
