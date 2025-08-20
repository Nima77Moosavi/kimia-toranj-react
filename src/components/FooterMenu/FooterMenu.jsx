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

const FooterMenu = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();

    const fetchCartItemsCount = async () => {
      try {
        const response = await axiosInstanceNoRedirect.get("api/store/cart/");
        const cartItems = response.data.items || [];
        setCartItemsCount(
          cartItems.reduce((sum, item) => sum + item.quantity, 0)
        );
      } catch (err) {
        // console.error("Cart fetch error:", err);
      }
    };

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

    fetchCartItemsCount();
    checkAuth();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
              {cartItemsCount > 0 && (
                <span className={styles.badge}>{cartItemsCount}</span>
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
