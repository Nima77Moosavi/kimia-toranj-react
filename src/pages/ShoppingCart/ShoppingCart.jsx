// ShoppingCart.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import Header from "../../components/Header/Header"; // Header component
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel"; // Sidebar navigation
import OrderStatusTabs from "../../components/OrderStatusTabs/OrderStatusTabs";
import styles from "./ShoppingCart.module.css";

const ShoppingCart = () => {
  // activeTab to control OrderStatusTabs (if you use this for filtering or similar)
  const [activeTab, setActiveTab] = useState(0);
  // State to hold the cart data returned from the API
  const [cartData, setCartData] = useState(null);
  // Track loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the cart data when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        // Assuming your API endpoint returns the authenticated customer's cart
        // and that your JWT middleware takes care of authentication
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

  // Sample function to update the quantity of an item
  // This just updates local state; you’d normally send a PATCH/PUT request to the API.
  const updateQuantity = async (itemId, newQuantity) => {
    if (!cartData) return;
    // Generate a new array of items with the updated quantity for the matching item.
    const updatedItems = cartData.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    // Update local state first
    setCartData({ ...cartData, items: updatedItems });

    // Then update backend (this assumes your API accepts a PATCH with an items array)
    try {
      await axiosInstance.patch(`${API_URL}api/store/cart`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to update item quantity", err);
      // Optionally: revert local state on error.
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content}>
          {/* <OrderStatusTabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}

          {loading && <p>Loading cart...</p>}
          {error && <p>{error}</p>}

          {cartData && cartData.items && cartData.items.length > 0 ? (
            <div>
              <h2>Your Shopping Cart</h2>
              <ul>
                {cartData.items.map((item) => (
                  <li key={item.id}>
                    <div>
                      {/* Assuming product_variant has a name or description */}
                      <p>
                        <strong>Product:</strong>{" "}
                        {item.product_variant?.name || "Product name"}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <div>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity > 1 ? item.quantity - 1 : 1
                            )
                          }
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
