import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Shop.module.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // New state for toggling filters dropdown in mobile
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

  // Helper: build query string from searchParams.
  const buildQueryString = () => {
    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
  };

  // Fetch products using query parameters.
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
        setProducts(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

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

  // When filtering by collection by name, pass the collection title.
  const filterByCollection = (collectionTitle) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("collection", collectionTitle);
    setSearchParams(newParams);
    // Optionally hide filters after selection (useful on mobile)
    setShowFilters(false);
  };

  // Handlers for sorting.
  const sortCheapest = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", "price");
    setSearchParams(newParams);
    setShowFilters(false);
  };

  const sortExpensive = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", "-price");
    setSearchParams(newParams);
    setShowFilters(false);
  };

  return (
    <div>
      <Header />
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
              <h2 className={styles.collectionsTitle}>فیلتر بر اساس مجموعه</h2>
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
          {loading ? (
            <div className={styles.loading}>در حال بارگذاری...</div>
          ) : error ? (
            <div className={styles.error}>خطا: {error}</div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
          ) : (
            products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))
          )}
        </div>

        {/* Desktop sidebar for filters */}
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebarInner}>
            <div className={styles.collections}>
              <h2 className={styles.collectionsTitle}>فیلتر بر اساس مجموعه</h2>
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

      {/* Mobile: Filter dropdown toggle button */}

      <Footer />
    </div>
  );
};

export default Shop;
