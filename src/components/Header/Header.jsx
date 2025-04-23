import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import { IoMenu } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { FaCartShopping } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5"; // آیکن جستجو
import { Link } from "react-router-dom";

import { FiHome } from "react-icons/fi";  
import { BsFileEarmarkPerson } from "react-icons/bs";
import { TbDeviceIpadHorizontalStar } from "react-icons/tb";
import { PiArticleBold } from "react-icons/pi";
import { LiaWineGlassSolid } from "react-icons/lia";

// مسیر عکس‌ها (فرضی)
import image1 from "../../assets/banner1.png";
import image3 from "../../assets/img.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  // بستن منو هنگام کلیک خارج از منو
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);
  return (
    <header className={styles.header}>
      {/* دایره طوسی */}
      {/* <div className={styles.circle}></div> */}

      <div className={styles.container}>
        {/* آیکن‌ها */}
        <div className={styles.icons}>
          <span><FaCartShopping /></span>
          <span><GoHeartFill /></span>
        </div>

        {/* دکمه ورود/ثبت نام */}
        <div className={styles.loginButton}>
          <Link to="/login">
            <button>ورود | ثبت نام</button>
          </Link>
        </div>

        {/* جعبه جستجو */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="جستجو کنید..." />
            <span className={styles.searchIcon}><IoSearch /></span>
          </div>
        </div>

        {/* منوی همبرگر */}
        <div className={styles.hamburgerMenu}>
          <span onClick={() => setIsMenuOpen(true)}>
            <IoMenu />
          </span>
        </div>
      </div>

      {/* عکس‌ها */}
      {/* <div className={styles.images}>
        <img src={image3} alt="Image 3" className={styles.dast} />
        <img src={image1} alt="Image 1" className={styles.txt1} />
      </div> */}

      {/* لایه تیره و منو */}
      {isMenuOpen && (
        <div className={styles.overlay}>
          <div className={styles.menu} ref={menuRef}>
            <ul>
            <Link to="/"><li>صفحه اصلی <FiHome /></li></Link>
              <li>درباره کیمیا ترنج <BsFileEarmarkPerson /></li>
              <li>اخذ نمایندگی <TbDeviceIpadHorizontalStar /></li>
              <li>مقالات <PiArticleBold /></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};


export default Header;