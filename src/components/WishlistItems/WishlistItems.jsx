import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./WishlistItems.module.css";
import { FiTrash2 } from "react-icons/fi";

const WishlistItems = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axiosInstance.get("api/store/liked-items/");
        setWishlist(data);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت علاقه‌مندی‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const handleRemoveItem = async (id) => {
    try {
      await axiosInstance.delete(`api/store/liked-items/${id}/`);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("خطا در حذف آیتم");
    }
  };

  // Stub: add to cart
  const handleAddToCart = (variantId) => {
    console.log("Add to cart variant:", variantId);
    // TODO: dispatch add-to-cart action or call your API
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
      <ul>
        {wishlist.map((item) => (
          <li key={item.id}>
            <div className={styles.itemImage}>
              <img src={item.product_variant.image} alt={item.product_title} />
            </div>
            <div className={styles.itemDetails}>
              <span className={styles.itemName}>{item.product_title}</span>
              <span className={styles.itemPrice}>
                {new Intl.NumberFormat("fa-IR").format(
                  item.product_variant.price
                )}{" "}
                تومان
              </span>
              <button
                className={styles.addToCart}
                onClick={() => handleAddToCart(item.product_variant.id)}
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
        ))}
      </ul>
    </div>
  );
};

export default WishlistItems;
