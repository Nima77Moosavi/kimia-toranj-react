import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineArticle } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
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
            <IoHomeOutline />
            <span>خانه</span>
          </Link>
        </li>
        <li>
          <Link to="/shop" className={styles.footerLink}>
            <FaShoppingBag />
            <span>فروشگاه</span>
          </Link>
        </li>
        <li>
          <Link to="/blog" className={styles.footerLink}>
            <MdOutlineArticle />
            <span>مقالات</span>
          </Link>
        </li>
        <li>
          <Link to="/login" className={styles.footerLink}>
            <BsPerson />
            <span>ورود</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterMenu;