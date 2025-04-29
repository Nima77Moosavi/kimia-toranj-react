import React from "react";
import styles from "./ShoppingCart.module.css";

const ShoppingCart = () => {
  return (
    <div className={styles.accountInfo}>
      <h2>اطلاعات حساب</h2>
      <p>نام: محمد رضایی</p>
      <p>کد ملی: ۱۲۳۴۵۶۷۸۹۰</p>
    </div>
  );
};

export default ShoppingCart; // خروجی پیش‌فرض کامپوننت
