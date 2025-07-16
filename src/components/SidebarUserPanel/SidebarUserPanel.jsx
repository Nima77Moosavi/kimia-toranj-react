// SidebarUserPanel.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SidebarUserPanel.module.css";

const items = [
  { to: "/user-panel", label: "داشبورد", end: true },
  { to: "/user-panel/account-info", label: "اطلاعات حساب" },
  { to: "/user-panel/cart", label: "سبد خرید" },
  { to: "/user-panel/orders", label: "سفارش‌ها" },
  { to: "/user-panel/wishlist", label: "علاقه‌مندی‌ها" },
  { to: "/user-panel/reviews", label: "دیدگاه‌ها" },
  { to: "/user-panel/addresses", label: "آدرس‌ها" },
];

const SidebarUserPanel = () => (
  <nav className={styles.sidebarNav}>
    {items.map(({ to, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        {label}
      </NavLink>
    ))}
  </nav>
);

export default SidebarUserPanel;
