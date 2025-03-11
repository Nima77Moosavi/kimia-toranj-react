import React from "react";
import styles from "./Header.module.css";
import { IoMenu } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { FaCartShopping } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5"; // آیکن جستجو
import { Link } from "react-router-dom";

// مسیر عکس‌ها (فرضی)
import image1 from "../../assets/banner1.png";
import image3 from "../../assets/img.png";

const Header = () => {
  return (
    <header className={styles.header}>
      {/* دایره طوسی */}
      <div className={styles.circle}></div>

      <div className={styles.container}>
        {/* آیکن‌ها */}
        <div className={styles.icons}>
          <span>
            <FaCartShopping />
          </span>
          <span>
          <GoHeartFill />
          </span>
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
            <span className={styles.searchIcon}>
              <IoSearch />
            </span>
          </div>
        </div>

        {/* منوی همبرگر */}
        <div className={styles.hamburgerMenu}>
          <span>
            <IoMenu />
          </span>
        </div>
      </div>

      {/* عکس‌ها */}
      <div className={styles.images}>
        <img src={image3} alt="Image 3" className={styles.dast} />
        <img src={image1} alt="Image 1" className={styles.txt1} />
      </div>
    </header>
  );
};

export default Header;