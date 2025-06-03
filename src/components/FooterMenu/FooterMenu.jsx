import React, { useState, useEffect } from 'react';
import styles from './FooterMenu.module.css';
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdOutlineArticle } from "react-icons/md";
import { BsPerson } from "react-icons/bs";

const FooterMenu = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // چک کردن سایز صفحه در اولین بارگذاری
    handleResize();

    // افزودن Event Listener برای تغییر سایز صفحه
    window.addEventListener('resize', handleResize);

    // حذف Event Listener هنگام unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null; // عدم نمایش در دسکتاپ

  return (
    <div className={styles.container}>
      <ul>
        <li>خانه<span><IoHomeOutline /></span></li>
        <li>دسته بندی<span><HiOutlineSquares2X2 /></span></li>
        <li>مقالات<span><MdOutlineArticle /></span></li>
        <li>ورود<span><BsPerson /></span></li>
      </ul>
    </div>
  );
};

export default FooterMenu;