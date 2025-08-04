// src/components/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user’s saved shipping addresses
  useEffect(() => {
    async function fetchAddresses() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          "/api/store/shipping-addresses/"
        );
        setAddresses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("خطا در بارگذاری آدرس‌ها");
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setError("لطفاً یک آدرس انتخاب کنید");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create order + request ZarinPal payment in one step
      const { data } = await axiosInstance.post(
        "/api/store/orders/create-pay/",
        { shipping_address_id: selectedAddressId }
      );

      // Redirect to ZarinPal checkout
      window.location.href = data.pay_url;
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "خطا در شروع فرآیند پرداخت. لطفاً دوباره تلاش کنید."
      );
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <h2>تأیید نهایی سفارش</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <ul className={styles.addressList}>
          {addresses.map((addr) => (
            <li key={addr.id}>
              <label>
                <input
                  type="radio"
                  name="selectedAddress"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelected(addr.id)}
                />
                {addr.state}، {addr.city}، {addr.address}
              </label>
            </li>
          ))}
        </ul>

        <button type="submit" disabled={loading}>
          {loading ? "در حال انتقال به درگاه…" : "پرداخت و ثبت سفارش"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
