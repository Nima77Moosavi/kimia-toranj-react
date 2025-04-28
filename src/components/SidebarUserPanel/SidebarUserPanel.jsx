import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SidebarUserPanel.module.css";

const SidebarUserPanel = ({ setSelectedSection, activeSection }) => {
  const navigate = useNavigate();

  // تابع برای تغییر بخش فعال و هدایت کاربر (در صورت نیاز)
  const handleLinkClick = (section, path) => {
    setSelectedSection(section);
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className={styles.sidebar}>
      {/* مستطیل اطلاعات کاربر */}
      <div className={styles.userInfo}>
        <p className={styles.username}>محمد رضایی</p>
        <button
          className={styles.editButton}
          onClick={() => handleLinkClick("accountInfo", "/account-info")}
        >
          ویرایش
        </button>
      </div>

      {/* منوی سایدبار */}
      <div className={styles.menuContainer}>
        <div className={styles.menu}>
          <p
            className={`${styles.link} ${
              activeSection === "accountInfo" ? styles.active : ""
            }`}
            onClick={() => handleLinkClick("accountInfo", "/account-info")}
          >
            اطلاعات حساب
          </p>
          <p
            className={styles.link}
            onClick={() => handleLinkClick("cart", "/cart")}
          >
            سبد خرید
          </p>
          <p
            className={styles.link}
            onClick={() => handleLinkClick("orders", "/orders")}
          >
            سفارش‌های من
          </p>
          <p
            className={styles.link}
            onClick={() => handleLinkClick("wishlist", "/wishlist")}
          >
            لیست موردعلاقه‌ها
          </p>
          <p
            className={styles.link}
            onClick={() => handleLinkClick("reviews", "/reviews")}
          >
            دیدگاه‌ها
          </p>
          <p
            className={styles.link}
            onClick={() => handleLinkClick("addresses", "/addresses")}
          >
            آدرس‌ها
          </p>
          <p
            className={styles.link}
            onClick={() => handleLinkClick("logout", "/")}
          >
            خروج
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserPanel;
