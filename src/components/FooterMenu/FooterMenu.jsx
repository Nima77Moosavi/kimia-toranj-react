import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineArticle } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa"; // Shop icon replacement
import styles from "./FooterMenu.module.css";

const FooterMenu = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    // Check screen size on first load
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();

    // Set up Intersection Observer only on mobile
    if (isMobile) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsFooterVisible(!entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0.1,
        }
      );

      if (footerRef.current) {
        observer.observe(footerRef.current);
      }

      return () => {
        if (footerRef.current) {
          observer.unobserve(footerRef.current);
        }
      };
    }
  }, [isMobile]);

  // Add window resize event listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div ref={footerRef} style={{ height: "1px" }}></div>

      {isMobile && isFooterVisible && (
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
              <Link to="/articles" className={styles.footerLink}>
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
      )}
    </>
  );
};

export default FooterMenu;
