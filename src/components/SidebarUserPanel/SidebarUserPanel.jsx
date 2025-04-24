import React from "react";
import { useNavigate } from "react-router-dom"; // اضافه شده
import styles from "./SidebarUserPanel.module.css";

const SidebarPanel = () => {
  const navigate = useNavigate(); // استفاده از useNavigate برای جابه‌جایی بین صفحات

  return (
    <div className={styles.sidebar}>
      <div className={styles.userInfo}>
        <p className={styles.username}>نام کاربر: محمد رضایی</p>
        <button
          className={styles.editButton}
          onClick={() => navigate("/account-info")}
        >
          ویرایش
        </button>
      </div>

      <div className={styles.menu}>
        <p className={styles.link} onClick={() => navigate("/account-info")}>
          اطلاعات حساب
        </p>
        <p className={styles.link} onClick={() => navigate("/cart")}>
          سبد خرید
        </p>
        <p className={styles.link} onClick={() => navigate("/orders")}>
          سفارش‌های من
        </p>
        <p className={styles.link} onClick={() => navigate("/wishlist")}>
          لیست موردعلاقه‌ها
        </p>
        <p className={styles.link} onClick={() => navigate("/reviews")}>
          دیدگاه‌ها
        </p>
        <p className={styles.link} onClick={() => navigate("/addresses")}>
          آدرس‌ها
        </p>
      </div>
    </div>
  );
};

export default SidebarPanel;
