import { IoMenu, IoSearch } from "react-icons/io5";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./HeaderMobile.module.css";

const HeaderMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      {/* Center: Search box */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="جستجو کنید..." />
          <IoSearch className={styles.searchIcon} />
        </div>
      </div>

      {/* Right: Hamburger Menu */}
      <div className={styles.hamburgerContainer} ref={menuRef}>
        <button
          className={styles.hamburgerButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Navigation menu"
        >
          <IoMenu size={36} color="#023047" />
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
