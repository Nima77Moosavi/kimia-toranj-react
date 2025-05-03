
import React, { useState } from "react";
import Header from "../../components/Header/Header"; // هدر
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel"; // سایدبار
import OrderStatusTabs from "../../components/OrderStatusTabs/OrderStatusTabs";
import styles from "./ShoppingCart.module.css";


const ShoppingCart = () => {
  // تعریف activeTab با useState
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <div className={styles.shoppingPage}>
          <OrderStatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <aside className={styles.sidebar}>
          <SidebarUserPanel activeSection="accountInfo" />
        </aside>
        <div className={styles.content}></div>
      </div>
    </div>
  );
};

export default ShoppingCart;
