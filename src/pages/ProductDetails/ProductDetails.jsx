// src/pages/ProductDetails/ProductDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.css";

import Header from "../../components/Header/Header";
import Bestsellers from "../../components/Bestsellers/Bestsellers";
import Footer from "../../components/Footer/Footer";
import MoonLoader from "react-spinners/MoonLoader";

import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import axios from "axios";
import { API_URL } from "../../config";

import ImageSlider from "./ImageSlider/ImageSlider";
import ProductTabs from "./ProductTabs/ProductTabs";
import ProductRating from "./ProductRating/ProductRating";
import PriceBox from "./PriceBox/PriceBox";
import IconsBox from "./IconsBox/IconsBox";
import ReviewForm from "./ReviewForm/ReviewForm";

// ✅ Import Zustand store
import { useCartStore } from "../../cartStore";

const ProductDetails = () => {
  const { slugAndId } = useParams();
  const navigate = useNavigate();
  const id = slugAndId.substring(slugAndId.lastIndexOf("-") + 1);

  const [product, setProduct] = useState({});
  const [likedItems, setLikedItems] = useState([]);
  const [like, setLike] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // ✅ Get addToCart from store
  const addToCart = useCartStore((state) => state.addToCart);

  // Load liked items
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

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}api/store/products/${id}/`);
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

  // Set like state
  useEffect(() => {
    const variantId = product.variants?.[0]?.id;
    setLike(
      Boolean(likedItems.find((li) => li.product_variant.id === variantId))
    );
  }, [likedItems, product.variants]);

  // ✅ Add to cart using store method
  const handleAddToCart = async () => {
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) throw new Error("Variant ID not available");

      await addToCart({
        product,
        variantId,
        price: product.variants?.[0]?.price || 0,
        orderCount: product.order_count || 1
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate(
          `/login?next=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }
      console.error("Error adding to cart:", err);
      setError("خطا در اضافه کردن به سبد خرید");
    }
  };

  // Like / Unlike
  const likeHandler = async () => {
    try {
      const variantId = product.variants?.[0]?.id;
      if (!variantId) return;

      if (like) {
        const likedItem = likedItems.find(
          (li) => li.product_variant.id === variantId
        );
        if (!likedItem) return;

        await axiosInstanceNoRedirect.delete(
          `${API_URL}api/store/liked-items/${likedItem.id}/`
        );

        setLikedItems((prev) => prev.filter((li) => li.id !== likedItem.id));
        setLike(false);
      } else {
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
              promotions={product.promotions || []}
              onAddToCart={handleAddToCart}
              stock={variant.stock || 0}
            />
            {product.order_count > 1 && (
              <p className={styles.orderStep}>
                حداقل سفارش: {product.order_count} عدد و مضارب آن
              </p>
            )}
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
