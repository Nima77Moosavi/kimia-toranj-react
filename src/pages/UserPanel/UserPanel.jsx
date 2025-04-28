import React, { useState } from "react";
import Header from "../../components/Header/Header"; // هدر
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel"; // سایدبار
import styles from "./UserPanel.module.css";
import AccountInfo from "../AccountInfo/AccountInfo"; // صفحه اطلاعات حساب (ویرایش)
import ShoppingCart from "../ShoppingCart/ShoppingCart"; // صفحه سبد خرید
import UserOrders from "../UserOrders/UserOrders"; // سفارش‌های من
import Wishlist from "../WishList/WishList"; // علاقه‌مندی‌ها
import UserReviews from "../UserReviews/UserReviews"; // دیدگاه‌ها
import UserAddresses from "../UserAddresses/UserAddresses"; // آدرس‌ها

const UserPanel = () => {
  // حالت پیش‌فرض: نمایش اطلاعات خواندنی کاربر (پنل کاربری)
  const [selectedSection, setSelectedSection] = useState("userPanel");

  // رندر بخش‌های مختلف پنل بر اساس بخش انتخاب‌شده
  const renderContent = () => {
    switch (selectedSection) {
      case "userPanel":
        return (
          <div className={styles.readOnly}>
            <h2>اطلاعات کاربری (فقط مشاهده)</h2>
            <p>نام: محمد رضایی</p>
            <p>ایمیل: example@example.com</p>
            <p>شماره تماس: 09123456789</p>
          </div>
        );
      case "accountInfo":
        return <AccountInfo />;
      case "cart":
        return <ShoppingCart />;
      case "orders":
        return <UserOrders />;
      case "wishlist":
        return <Wishlist />;
      case "reviews":
        return <UserReviews />;
      case "addresses":
        return <UserAddresses />;
      default:
        return (
          <div className={styles.readOnly}>
            <h2>اطلاعات کاربری (فقط مشاهده)</h2>
            <p>نام: محمد رضایی</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      {/* بخش اصلی شامل سایدبار و محتوا */}
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <SidebarUserPanel
            setSelectedSection={setSelectedSection}
            activeSection={selectedSection}
          />
        </aside>
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserPanel;
