import React, { useState } from "react";
import styles from "./AddressForm.module.css";

const AddressForm = () => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`آدرس جدید ثبت شد: ${address}`);
    setAddress("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>ثبت آدرس جدید</h3>
      <input
        type="text"
        placeholder="آدرس جدید را وارد کنید"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        ثبت
      </button>
    </form>
  );
};

export default AddressForm;
