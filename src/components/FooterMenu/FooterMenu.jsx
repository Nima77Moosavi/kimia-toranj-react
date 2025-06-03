import React, { useState, useEffect, useRef } from 'react';
import styles from './FooterMenu.module.css';
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdOutlineArticle } from "react-icons/md";
import { BsPerson } from "react-icons/bs";

const FooterMenu = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    // بررسی سایز صفحه در اولین بارگذاری
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();

    // تنظیم Intersection Observer فقط در موبایل
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

  // اضافه کردن event listener برای تغییر سایز صفحه
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div ref={footerRef} style={{ height: '1px' }}></div>
      
      {isMobile && isFooterVisible && (
        <div className={styles.container}>
          <ul className={styles.footerul}>
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