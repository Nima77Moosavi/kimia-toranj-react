import React from "react";
import styles from "./AccountInfo.module.css";

const AccountInfo = () => {
  return (
    <div className={styles.accountInfo}>
      <h2>اطلاعات حساب</h2>
      <p>نام: محمد رضایی</p>
      <p>کد ملی: ۱۲۳۴۵۶۷۸۹۰</p>
    </div>
  );
};

export default AccountInfo; // خروجی پیش‌فرض کامپوننت
