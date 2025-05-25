import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu, IoSearch } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { FaCartShopping } from "react-icons/fa6";
import { BsFileEarmarkPerson } from "react-icons/bs";
import styles from "./HeaderMobile.module.css";

const HeaderMobile = () => {
  // State for toggling the profile dropdown (profile, cart, likes)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // State for toggling the hamburger menu dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs for detecting clicks outside these dropdown areas
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
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
      {/* Left: Profile button with dropdown */}
      <div className={styles.profileContainer} ref={profileRef}>
        <button
          className={styles.profileButton}
          onClick={() => setIsProfileOpen((prev) => !prev)}
          aria-label="User profile options"
        >
          <span>
            <BsFileEarmarkPerson />
          </span>
        </button>
        {isProfileOpen && (
          <div className={styles.profileDropdown}>
            <Link to="/profile" className={styles.dropdownIcon}>
              <BsFileEarmarkPerson />
            </Link>
            <Link to="/cart" className={styles.dropdownIcon}>
              <FaCartShopping />
            </Link>
            <Link to="/favorites" className={styles.dropdownIcon}>
              <GoHeartFill />
            </Link>
          </div>
        )}
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
              {/* Add more icons as needed */}
            </ul>
          </div>
        )}
      </div>

   
    </header>
  );
};

export default HeaderMobile;
