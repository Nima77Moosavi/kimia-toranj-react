import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  IoHomeOutline, 
  IoBagOutline, 
  IoCartOutline, 
  IoPersonOutline 
} from "react-icons/io5";
import styles from "./FooterMenu.module.css";

const FooterMenu = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();

    const handleResize = () => {
      checkScreenSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) return null;

  return (
    <div className={styles.container}>
      <ul className={styles.footerul}>
        <li>
          <Link to="/" className={styles.footerLink}>
            <IoHomeOutline size={24} />
            <span>خانه</span>
          </Link>
        </li>
        <li>
          <Link to="/shop" className={styles.footerLink}>
            <IoBagOutline size={24} />
            <span>فروشگاه</span>
          </Link>
        </li>
        <li>
          <Link to="/user-panel/cart" className={styles.footerLink}>
            <IoCartOutline size={24} />
            <span>سبد خرید</span>
          </Link>
        </li>
        <li>
          <Link to="/login" className={styles.footerLink}>
            <IoPersonOutline size={24} />
            <span>ورود</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterMenu;
