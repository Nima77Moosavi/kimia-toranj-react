import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import Header from "../../components/Header/Header";
import Bestsellers from "../../components/Bestsellers/Bestsellers";
import Footer from "../../components/Footer/Footer";
import MoonLoader from "react-spinners/MoonLoader";
import { FavoritesContext } from "../../context/FavoritesContext";
import axiosInstance from "../../utils/axiosInstance";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [like, setLike] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  const formatPrice = (price) => new Intl.NumberFormat("fa-IR").format(price);

  // Add to cart (unchanged)
  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}api/store/cart`);
      const currentCart = response.data;
      let currentItems =
        currentCart.items
          ?.filter((item) => item.product_variant?.id)
          .map((item) => ({
            product_variant_id: item.product_variant.id,
            quantity: item.quantity,
          })) || [];

      const variantId = product?.variants?.[0]?.id;
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

  // Like/unlike handler (unchanged)
  const likeHandler = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      setLike(false);
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        image: product.images?.[0]?.image || "",
        price: product.variants?.[0]?.price || "",
      });
      setLike(true);
    }
  };

  // set initial like state
  useEffect(() => {
    setLike(isFavorite(parseInt(id)));
  }, [id, isFavorite]);

  // ─── HERE’S THE ONLY CHANGE ───
  // fetch product (with real reviews) via axios
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${API_URL}api/store/products/${id}/`
        );
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "خطا در دریافت محصول");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
  // ────────────────────────────────

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
              price={formatPrice(variant.price || 0)}
              onAddToCart={handleAddToCart}
              inventoryText={`تنها ${variant.stock || 0} عدد در انبار`}
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
