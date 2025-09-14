import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { formatPrice } from "../../utils/formatPrice";
import { API_URL } from "../../config";
import styles from "./HeaderDesktop.module.css";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { BsFileEarmarkPerson } from "react-icons/bs";
import { TbDeviceIpadHorizontalStar } from "react-icons/tb";
import { PiArticleBold } from "react-icons/pi";
import { IoBagOutline, IoHelpCircleOutline } from "react-icons/io5";
import { GoGift } from "react-icons/go";

import image1 from "../../assets/banner11.png";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";

// Zustand store
import { useCartStore } from "../../cartStore";

const HeaderDesktop = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const debounceRef = useRef();
  const menuRef = useRef();
  const suggestionsRef = useRef();
  const navigate = useNavigate();

  // Zustand store hooks
  const cartCount = useCartStore((state) => state.cartCount());
  const fetchCartFromBackend = useCartStore(
    (state) => state.fetchCartFromBackend
  );

  // Fetch cart + auth on mount
  useEffect(() => {
    fetchCartFromBackend();

    const checkAuth = async () => {
      try {
        const response = await axiosInstanceNoRedirect.get(
          "api/store/customer/me/"
        );
        if (response.status === 200 && response.data) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [fetchCartFromBackend]);

  // Close menus on outside click or scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    const handleScroll = () => setIsMenuOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Search suggestions
  useEffect(() => {
    if (!showSuggestions) return;
    const q = searchTerm.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get(
          `${API_URL}api/store/products/?title=${encodeURIComponent(q)}`
        );
        setSuggestions(data.results.slice(0, 8));
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, showSuggestions]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Cart Icon */}
        <div className={styles.icons}>
          <Link to="/user-panel/cart">
            <span className={styles.cartIcon}>
              <FaCartShopping />
            </span>
            <span className={styles.cartItemsCount}>{cartCount}</span>
          </Link>
        </div>

        {/* Logo */}
        <Link to="/">
          <div className={styles.logoContainer}>
            <img src={image1} alt="کیمیاترنج" className={styles.logo} />
          </div>
        </Link>

        {/* Login / User Panel */}
        <div className={styles.loginButton}>
          <Link to={isLoggedIn ? "/user-panel" : "/login"}>
            <button>{isLoggedIn ? "پنل کاربری" : "ورود | ثبت نام"}</button>
          </Link>
        </div>

        {/* Search */}
        <div className={styles.searchContainer} ref={suggestionsRef}>
          <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="جستجو کنید..."
            />
            <button type="submit" className={styles.searchIcon}>
              <IoSearch />
            </button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {suggestions.map((prod) => (
                <li
                  key={prod.id}
                  className={styles.suggestionItem}
                  onClick={() => {
                    navigate(`/product/${prod.url_title}-${prod.id}`);
                    setShowSuggestions(false);
                    setSearchTerm("");
                  }}
                >
                  <div className={styles.suggestionImageWrapper}>
                    <img
                      src={prod.images[0].image} // adjust key if your API uses a different field
                      alt={prod.title}
                      className={styles.suggestionImage}
                    />
                  </div>
                  <div className={styles.suggestionContent}>
                    <div className={styles.suggestionTitle}>{prod.title}</div>
                    <div className={styles.suggestionMeta}>
                      {prod.collection?.title} •{" "}
                      {formatPrice(
                        prod.variants?.[0]?.price?.toLocaleString() || "0"
                      )}{" "}
                      تومان
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className={styles.hamburgerMenu}>
          <span onClick={() => setIsMenuOpen(true)}>
            <IoMenu />
          </span>
        </div>
      </div>

      {/* Overlay Menu */}
      {isMenuOpen && (
        <div className={styles.overlay}>
          <div className={styles.menu} ref={menuRef}>
            <ul>
              <Link to="/">
                <li>
                  صفحه اصلی <FiHome />
                </li>
              </Link>
              <Link to="/shop">
                <li>
                  فروشگاه <IoBagOutline />
                </li>
              </Link>
              <Link to="/gift-selector">
                <li>
                  کادو چی بخرم <GoGift />
                </li>
              </Link>
              <Link to="/about">
                <li>
                  درباره ما <BsFileEarmarkPerson />
                </li>
              </Link>
              <Link to="/">
                <li>
                  اخذ نمایندگی <TbDeviceIpadHorizontalStar />
                </li>
              </Link>
              <Link to="/blog">
                <li>
                  مقالات <PiArticleBold />
                </li>
              </Link>
              <Link to="/faq">
                <li>
                  سوالات متداول <IoHelpCircleOutline />
                </li>
              </Link>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderDesktop;
