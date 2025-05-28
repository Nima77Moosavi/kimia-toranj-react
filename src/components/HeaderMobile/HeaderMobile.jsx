import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { BsFileEarmarkPerson } from "react-icons/bs";
import styles from "./HeaderMobile.module.css";

const HeaderMobile = () => {
  // Remove profile dropdown state since we're now showing two static icons.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ref for the hamburger menu dropdown
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.headerMobile}>
      {/* Left: Two icons side by side for login and cart */}
      <div className={styles.profileContainer}>
        <Link to="/login" className={styles.iconLink}>
          <BsFileEarmarkPerson />
        </Link>
        <Link to="/" className={styles.iconLink}>
          <FaCartShopping />
        </Link>
      </div>

      {/* Center: Search box */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="جستجو کنید..." />
          <IoSearch className={styles.searchIcon} />
        </div>
      </div>

      {/* Right: Hamburger menu */}
      <div className={styles.hamburgerContainer} ref={menuRef}>
        <button
          className={styles.hamburgerButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Navigation menu"
        >
          <IoMenu />
        </button>
        {isMenuOpen && (
          <div className={styles.menuDropdown}>
            <ul>
              <li className={styles.menuIcon}>
                <Link to="/">صفحه اصلی</Link>
              </li>
              <li className={styles.menuIcon}>
                <Link to="/about">درباره ما</Link>
              </li>
              <li className={styles.menuIcon}>
                <Link to="/blog">مقالات</Link>
              </li>
              {/* Add more items as needed */}
            </ul>
          </div>
        )}
      </div>

   
    </header>
  );
};

export default HeaderMobile;
