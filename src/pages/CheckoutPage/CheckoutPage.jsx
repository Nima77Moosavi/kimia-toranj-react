import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/store/shipping-addresses/");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setError("لطفاً یک آدرس انتخاب کنید");
      return;
    }
    try {
      setLoading(true);
      const payload = { shipping_address_id: selectedAddressId };
      const response = await axiosInstance.post("/api/store/orders/", payload);
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
        <div className={styles.addressHeader}>
          <h3>انتخاب آدرس ارسال</h3>
          <Link 
            to="/user-panel/addresses" 
            className={styles.addAddressButton}
          >
            افزودن آدرس جدید
          </Link>
        </div>
        
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