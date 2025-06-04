// AddressForm.jsx
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./AddressForm.module.css"; // Create or adjust this CSS file as needed

const AddressForm = ({ onAddressAdded }) => {
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [postalCodeInput, setPostalCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        state: stateInput,
        city: cityInput,
        address: addressInput,
        postal_code: postalCodeInput,
      };
      const response = await axiosInstance.post(
        "/api/store/shipping-addresses/",
        payload
      );
      setLoading(false);

      // Optionally, inform the parent component of the new address
      if (onAddressAdded) {
        onAddressAdded(response.data);
      }

      // Clear the form fields after successful submission
      setStateInput("");
      setCityInput("");
      setAddressInput("");
      setPostalCodeInput("");
    } catch (err) {
      console.error("Error adding address:", err);
      setError("خطا در افزودن آدرس");
      setLoading(false);
    }
  };

  return (
    <form className={styles.addressForm} onSubmit={handleSubmit}>
      <h3>افزودن آدرس جدید</h3>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formGroup}>
        <label>استان:</label>
        <input
          type="text"
          value={stateInput}
          onChange={(e) => setStateInput(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>شهر:</label>
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>آدرس:</label>
        <textarea
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>کد پستی:</label>
        <input
          type="text"
          value={postalCodeInput}
          onChange={(e) => setPostalCodeInput(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "در حال افزودن..." : "افزودن آدرس"}
      </button>
    </form>
  );
};

export default AddressForm;
