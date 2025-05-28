import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import Header from "../../components/Header/Header";
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel";
import styles from "./ShoppingCart.module.css";

const ShoppingCart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the cart data when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${API_URL}api/store/cart`);
        setCartData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error loading cart");
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Function to update the quantity of an item in the cart.
  const updateQuantity = async (itemId, newQuantity) => {
    if (!cartData) return;

    const updatedItems = cartData.items.map((item) => {
      return item.id === itemId
        ? { product_variant_id: item.product_variant.id, quantity: newQuantity }
        : {
            product_variant_id: item.product_variant.id,
            quantity: item.quantity,
          };
    });

    // Optimistically update local state
    const updatedLocalItems = cartData.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartData({ ...cartData, items: updatedLocalItems });

    try {
      await axiosInstance.patch(`${API_URL}api/store/cart`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to update item quantity", err);
      // Optionally revert local state on error.
    }
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartMain}>
        <div className={styles.cartContent}>
          {loading && <p>Loading cart...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {cartData && cartData.items && cartData.items.length > 0 ? (
            <div>
              <h2 className={styles.cartTitle}>Your Shopping Cart</h2>
              <div className={styles.itemsList}>
                {cartData.items.map((item) => {
                  // Attempt to get the first image URL from product images.
                  const imageUrl =
                    item.product_variant?.product?.images &&
                    item.product_variant.product.images.length > 0
                      ? item.product_variant.product.images[0].image
                      : "/placeholder.png"; // Fallback to placeholder if no image

                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        <img
                          src={imageUrl}
                          alt={
                            item.product_variant?.product?.title ||
                            "Product Image"
                          }
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemTitle}>
                          {item.product_variant?.product?.title ||
                            "Product Name"}
                        </h3>
                        <p className={styles.itemDescription}>
                          {item.product_variant?.product?.description || ""}
                        </p>
                        <p className={styles.itemPrice}>
                          Price: {item.product_variant?.price} تومان
                        </p>
                        <p className={styles.itemQuantity}>
                          Quantity: <span>{item.quantity}</span>
                        </p>
                        <div className={styles.quantityControls}>
                          <button
                            className={styles.qtyButton}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            –
                          </button>
                          <button
                            className={styles.qtyButton}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            !loading && <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
