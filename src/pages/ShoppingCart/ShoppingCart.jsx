// ShoppingCart.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import Header from "../../components/Header/Header";
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel";
import OrderStatusTabs from "../../components/OrderStatusTabs/OrderStatusTabs";
import { FaTrash, FaMinus } from "react-icons/fa"; // Import icons
import styles from "./ShoppingCart.module.css";

const ShoppingCart = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const updateQuantity = async (itemId, newQuantity) => {
    if (!cartData || newQuantity < 1) return;
    
    const updatedItems = cartData.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartData({ ...cartData, items: updatedItems });

    try {
      await axiosInstance.patch(`${API_URL}api/store/cart`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to update item quantity", err);
    }
  };

  const removeItem = async (itemId) => {
    if (!cartData) return;
    
    try {
      await axiosInstance.delete(`${API_URL}api/store/cart/items/${itemId}`);
      const updatedItems = cartData.items.filter(item => item.id !== itemId);
      setCartData({ ...cartData, items: updatedItems });
    } catch (err) {
      console.error("Failed to remove item", err);
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
              <h2 className={styles.title}>سبد خرید شما</h2>
              <ul className={styles.itemsList}>
                {cartData.items.map((item) => (
                  <li key={item.id} className={styles.itemContainer}>
                    <div className={styles.item}>
                      <p className={styles.productName}>
                        <strong>نام محصول:</strong>{" "}
                        {item.product_variant?.name || "محصول"}
                      </p>
                      
                      <div className={styles.quantityControl}>
                        
                      {item.quantity === 1 ? (
                          <button
                            className={`${styles.quantityButton} ${styles.deleteButton}`}
                            onClick={() => removeItem(item.id)}
                          >
                            <FaTrash />
                          </button>
                        ) : (
                          <button
                            className={`${styles.quantityButton} ${styles.minusButton}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                        )}
                        <span className={styles.quantityDisplay}>
                          {item.quantity}
                        </span>
                        <button
                          className={`${styles.quantityButton} ${styles.plusButton}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            !loading && <p>سبد خرید شما خالی است.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;