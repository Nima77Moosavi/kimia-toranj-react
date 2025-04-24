import React, { useState } from "react";
import Header from "../../components/Header/Header"; // هدر
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel"; // سایدبار
import styles from "./UserPanel.module.css";
import AccountInfo from "../AccountInfo/AccountInfo"; // صفحه اطلاعات حساب
import ShoppingCart from "../ShoppingCart/ShoppingCart"; // صفحه سبد خرید
import UserOrders from "../UserOrders/UserOrders"; // سفارش‌های من
import Wishlist from "../WishList/WishList"; // علاقه‌مندی‌ها
import UserReviews from "../UserReviews/UserReviews"; // دیدگاه‌ها
import UserAddresses from "../UserAddresses/UserAddresses"; // آدرس‌ها
const UserPanel = () => {
  const [selectedSection, setSelectedSection] = useState("accountInfo"); // تعیین بخش فعال

  // رندر بخش‌های مختلف پنل بر اساس بخش انتخاب‌شده
  const renderContent = () => {
    switch (selectedSection) {
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
        return <AccountInfo />;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        {/* قرار دادن سایدبار در کنار محتوا */}
        <SidebarUserPanel setSelectedSection={setSelectedSection} />
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserPanel;
