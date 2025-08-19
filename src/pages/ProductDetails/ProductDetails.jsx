// src/pages/ProductDetails/ProductDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";

import Header from "../../components/Header/Header";
import Bestsellers from "../../components/Bestsellers/Bestsellers";
import Footer from "../../components/Footer/Footer";
import MoonLoader from "react-spinners/MoonLoader";

import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";
import { API_URL } from "../../config";

import ImageSlider from "./ImageSlider/ImageSlider";
import ProductTabs from "./ProductTabs/ProductTabs";
import ProductRating from "./ProductRating/ProductRating";
import PriceBox from "./PriceBox/PriceBox";
import IconsBox from "./IconsBox/IconsBox";
import ReviewForm from "./ReviewForm/ReviewForm";

const ProductDetails = () => {
  const { slugAndId } = useParams();
  const id = slugAndId.substring(slugAndId.lastIndexOf("-") + 1);

  const [product, setProduct] = useState({});
  const [likedItems, setLikedItems] = useState([]);
  const [like, setLike] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 1. Load user's liked-items from the server
  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const { data } = await axiosInstanceNoRedirect.get(
          `${API_URL}api/store/liked-items/`
        );
        setLikedItems(data);
      } catch (err) {
        console.error("Failed to load liked items:", err);
      }
    };
    fetchLikedItems();
  }, []);

  // 2. Load the product details (including reviews)
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}api/store/products/${id}/`
        );
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err.message || "خطا در دریافت محصول");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // 3. Derive the `like` flag from likedItems + current variant
  useEffect(() => {
    const variantId = product.variants?.[0]?.id;
    setLike(
      Boolean(likedItems.find((li) => li.product_variant.id === variantId))
    );
  }, [likedItems, product.variants]);

  // Unchanged: Add to cart handler
  const handleAddToCart = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}api/store/cart/`);
      const currentCart = res.data;
      let currentItems =
        currentCart.items
          ?.filter((it) => it.product_variant?.id)
          .map((it) => ({
            product_variant_id: it.product_variant.id,
            quantity: it.quantity,
          })) || [];

      const variantId = product.variants?.[0]?.id;
      if (!variantId) throw new Error("Variant ID not available");

      const idx = currentItems.findIndex(
        (it) => it.product_variant_id === variantId
      );
      const newItems = [...currentItems];
      if (idx >= 0) newItems[idx].quantity += 1;
      else newItems.push({ product_variant_id: variantId, quantity: 1 });

      await axiosInstance.patch(`${API_URL}api/store/cart/`, {
        items: newItems,
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error("Cart error:", err);
      setError("خطا در اضافه کردن به سبد خرید");
    }
  };

  // 4. Like / Unlike handler matching your DRF serializer
  const likeHandler = async () => {
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) return;

      if (like) {
        // Find the LikedItem instance for this variant
        const likedItem = likedItems.find(
          (li) => li.product_variant.id === variantId
        );
        if (!likedItem) return;

        // DELETE /liked-items/{pk}/
        await axiosInstanceNoRedirect.delete(
          `${API_URL}api/store/liked-items/${likedItem.id}/`
        );

        // Update local state
        setLikedItems((prev) => prev.filter((li) => li.id !== likedItem.id));
        setLike(false);
      } else {
        // POST /liked-items/ with only product_variant_id
        const payload = { product_variant_id: variantId };
        const { data: newLikedItem } = await axiosInstanceNoRedirect.post(
          `${API_URL}api/store/liked-items/`,
          payload
        );

        setLikedItems((prev) => [...prev, newLikedItem]);
        setLike(true);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      // Show a toast or inline message if you like
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <MoonLoader color="#023047" />
      </div>
    );
  }
  if (error) {
    return <div className={styles.errorContainer}>خطا: {error}</div>;
  }

  const variant = product.variants?.[0] || {};

  return (
    <div className={styles.productPage}>
      <Header />

      {showSuccessMessage && (
        <div className={styles.successToast}>
          <div className={styles.toastContent}>
            <span>✓</span>
            <p>محصول مورد نظر به سبد خرید اضافه شد</p>
          </div>
        </div>
      )}

      <div className={styles.pageContent}>
        <div className={styles.circle}></div>

        {product.images?.length > 0 && <ImageSlider images={product.images} />}

        <div className={styles.container}>
          <div className={styles.leftSidebar}>
            <PriceBox
              price={variant.price || 0}
              onAddToCart={handleAddToCart}
              stock={variant.stock || 0}
            />
          </div>

          <ProductTabs
            product={product}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showAllReviews={showAllReviews}
            setShowAllReviews={setShowAllReviews}
          />
        </div>

        <IconsBox isLiked={like} onLikeClick={likeHandler} />

        <ProductRating rating={product.average_rating || 0} />

        <ReviewForm productId={id} />

        <Bestsellers />
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
