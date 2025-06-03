import React, { useState, useEffect, useRef } from 'react';
import styles from './FooterMenu.module.css';
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdOutlineArticle } from "react-icons/md";
import { BsPerson } from "react-icons/bs";

const FooterMenu = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // اگر فوتر اصلی در viewport قرار گرفت، منو را مخفی کنید
        setIsFooterVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1, // وقتی ۱۰٪ فوتر وارد viewport شد
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
  }, []);

  return (
    <>
      {/* این div در انتهای صفحه (قبل از فوتر اصلی) قرار می‌گیرد */}
      <div ref={footerRef} style={{ height: '1px' }}></div>

      {/* منوی پایین صفحه (فقط وقتی فوتر اصلی دیده نمی‌شود نمایش داده می‌شود) */}
      {isFooterVisible && (
        <div className={styles.container}>
          <ul>
            <li>خانه<span><IoHomeOutline /></span></li>
            <li>دسته‌بندی<span><HiOutlineSquares2X2 /></span></li>
            <li>مقالات<span><MdOutlineArticle /></span></li>
            <li>ورود<span><BsPerson /></span></li>
          </ul>
        </div>
      )}
    </>
  );
};

export default FooterMenu;