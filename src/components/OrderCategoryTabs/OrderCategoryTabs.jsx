import React from "react";
import styles from "./OrderCategoryTabs.module.css";

const OrderCategoryTabs = () => {
  return (
    <div className={styles.tabs}>
      <button onClick={() => setSelectedCategory("current")}>
        سفارش‌های جاری
      </button>
      <button onClick={() => setSelectedCategory("delivered")}>
        تحویل شده
      </button>
      <button onClick={() => setSelectedCategory("returned")}>مرجوعی</button>
    </div>
  );
};

export default OrderCategoryTabs;
