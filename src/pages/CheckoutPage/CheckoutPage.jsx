import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css"; // Create this CSS file or adjust accordingly

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  // Fetch the user's shipping addresses from the API.
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/store/shipping-addresses/");
        // Ensure that we always have an array.
        setAddresses(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("خطا در بارگذاری آدرس‌ها");
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // When the user submits the form, create the order.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setError("لطفاً یک آدرس انتخاب کنید");
      return;
    }
    try {
      setLoading(true);
      // The payload must include the shipping_address_id field
      const payload = { shipping_address_id: selectedAddressId };
      
      // Call the order creation endpoint—this API will convert the cart to an order.
      const response = await axiosInstance.post("/api/store/orders/", payload);
      
      // Optionally, navigate to an order confirmation page with response data.
      navigate("/order-confirmation", { state: { order: response.data } });
    } catch (err) {
      console.error("Error creating order:", err);
      setError("خطا در ایجاد سفارش");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <h2>تأیید نهایی سفارش</h2>
      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <h3>انتخاب آدرس ارسال</h3>
        {addresses.length === 0 && !loading ? (
          <p>هیچ آدرسی یافت نشد.</p>
        ) : (
          <ul className={styles.addressList}>
            {addresses.map((address) => (
              <li key={address.id} className={styles.addressItem}>
                <label>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  <span>
                    {address.state}، {address.city}، {address.address}، {address.postal_code}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <button type="submit" disabled={loading}>
          ثبت سفارش
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
