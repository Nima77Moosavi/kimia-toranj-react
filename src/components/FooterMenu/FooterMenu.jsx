import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  IoHomeOutline,
  IoBagOutline,
  IoCartOutline,
  IoPersonOutline,
} from "react-icons/io5";
import styles from "./FooterMenu.module.css";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";

// ✅ Use Zustand store
import { useCartStore } from "../../cartStore";

const FooterMenu = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Get cart count and fetch method from store
  const cartCount = useCartStore((state) => state.cartCount());
  const fetchCartFromBackend = useCartStore((state) => state.fetchCartFromBackend);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();

    const checkAuth = async () => {
      try {
        const res = await axiosInstanceNoRedirect.get("api/store/customer/me/");
        if (res.status === 200 && res.data) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    // ✅ Load cart from backend via store
    fetchCartFromBackend();
    checkAuth();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [fetchCartFromBackend]);

  if (!isMobile) return null;

  return (
    <div className={styles.container}>
      <ul className={styles.footerul}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.footerLink} ${isActive ? styles.active : ""}`
            }
          >
            <IoHomeOutline size={24} />
            <span>خانه</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `${styles.footerLink} ${isActive ? styles.active : ""}`
            }
          >
            <IoBagOutline size={24} />
            <span>فروشگاه</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user-panel/cart"
            className={({ isActive }) =>
              `${styles.footerLink} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.iconWrapper}>
              <IoCartOutline size={24} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </div>
            <span>سبد خرید</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={isLoggedIn ? "/user-panel" : "/login"}
            className={({ isActive }) =>
              `${styles.footerLink} ${isActive ? styles.active : ""}`
            }
          >
            <IoPersonOutline size={24} />
            <span>{isLoggedIn ? "پنل کاربری" : "ورود"}</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default FooterMenu;
