import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./WishlistItems.module.css";
import { FiTrash2 } from "react-icons/fi";

const WishlistItems = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch liked items on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axiosInstance.get("/api/store/liked-items/");
        setWishlist(data);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت لیست علاقه‌مندی‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Remove an item from wishlist
  const handleRemoveItem = async (id) => {
    try {
      await axiosInstance.delete(`/api/store/liked-items/${id}/`);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("خطا در حذف از لیست علاقه‌مندی‌ها");
    }
  };

  // Stub: Add to cart
  const handleAddToCart = (variantId) => {
    console.log("Add to cart variant:", variantId);
    // TODO: call cart API or dispatch Redux action
  };

  if (loading) {
    return <div className={styles.message}>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className={styles.messageError}>{error}</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        لیست علاقه‌مندی‌های شما خالی است
      </div>
    );
  }

  return (
    <div className={styles.wishlist}>
      <h3>لیست علاقه‌مندی‌ها</h3>
      <ul className={styles.list}>
        {wishlist.map((item) => {
          const variant = item.product_variant;
          const product = variant.product;
          // Grab the first image URL (fallback to placeholder)
          const imgUrl = product.images?.[0]?.image || "/placeholder.jpg";

          return (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemImage}>
                <img src={imgUrl} alt={product.title} />
              </div>

              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{product.title}</span>
                <span className={styles.itemPrice}>
                  {new Intl.NumberFormat("fa-IR").format(variant.price)} تومان
                </span>
                <button
                  className={styles.addToCart}
                  onClick={() => handleAddToCart(variant.id)}
                >
                  افزودن به سبد خرید
                </button>
              </div>

              <button
                className={styles.deleteButton}
                onClick={() => handleRemoveItem(item.id)}
                aria-label="حذف از لیست علاقه‌مندی‌ها"
              >
                <FiTrash2 />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WishlistItems;
