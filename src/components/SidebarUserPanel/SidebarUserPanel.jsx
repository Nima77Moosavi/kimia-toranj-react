import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./SidebarUserPanel.module.css";

const items = [
  { to: "/user-panel/account-info", label: "اطلاعات حساب" },
  { to: "/user-panel/cart", label: "سبد خرید" },
  { to: "/user-panel/orders", label: "سفارش‌ها" },
  { to: "/user-panel/wishlist", label: "علاقه‌مندی‌ها" },
  { to: "/user-panel/reviews", label: "دیدگاه‌ها" },
  { to: "/user-panel/addresses", label: "آدرس‌ها" },
];

const SidebarUserPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.wrapper}>
      {/* Mobile Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="منوی کاربری"
      >
        {/* Simple hamburger icon */}
        منوی کاربری
      </button>

      {/* Sidebar Nav (desktop always shown; mobile only if isOpen) */}
      <nav
        className={`
          ${styles.sidebarNav}
          ${isOpen ? styles.open : ""}
        `}
      >
        {items.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
            onClick={() => setIsOpen(false)}  // close menu on mobile after click
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SidebarUserPanel;
