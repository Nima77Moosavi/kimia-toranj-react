import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "./CollectionDetail.module.css";
import ProductList from "../../components/ProductList/ProductList";
import SidebarFilter from "../../components/SidebarFilter/SidebarFilter";

const CollectionDetail = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/store/collections/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch collection details");
        }
        const data = await response.json();
        setCollection(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/store/collections/${id}/products/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCollectionDetail();
    fetchProducts();
  }, [id]);

  // Wrap the function in useCallback to avoid infinite re-renders
  const handleFilters = useCallback((filterParams) => {
    console.log("Applied Filters:", filterParams);
    fetchFilteredProducts(filterParams);
  }, []);

  const fetchFilteredProducts = async (filterParams) => {
    const queryParams = new URLSearchParams(filterParams).toString();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/store/collections/${id}/products/?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filtered products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!collection)
    return <div className={styles.error}>No collection found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src={collection.image}
          alt={collection.title}
          className={styles.image}
        />
        <div className={styles.details}>
          <h1 className={styles.title}>{collection.title}</h1>
          <p className={styles.description}>{collection.description}</p>
        </div>
      </div>

      <div className={styles.content}>
        <SidebarFilter
          attributes={collection.attributes || []}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onFilterChange={handleFilters}
        />
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default CollectionDetail;
