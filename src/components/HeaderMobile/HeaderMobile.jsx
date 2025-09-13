import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMenu, IoSearch, IoClose } from "react-icons/io5";
import axiosInstance from "../../utils/axiosInstance";
import { toPersianDigits } from "../../utils/faDigits";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./HeaderMobile.module.css";
import image1 from "../../assets/banner11.png";

const HeaderMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef();

  // 1) Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  // 2) Close suggestions when clicking outside
  useEffect(() => {
    if (!showSuggestions) return;
    const handleClick = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSuggestions]);

  // 3) Debounced search
  useEffect(() => {
    if (searchTerm.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/store/products/?title=${encodeURIComponent(searchTerm)}`
        );
        // assuming your API returns { results: [...] }
        const items = data.results || data;
        setSuggestions(items.slice(0, 8));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (prod) => {
    navigate(`/product/${prod.url_title}-${prod.id}`);
    setShowSuggestions(false);
  };

  return (
    <header className={styles.headerMobile}>
      {/* Logo */}
      <Link to="/">
        <div className={styles.logoContainer}>
          <img src={image1} alt="کیمیاترنج" className={styles.logo} />
        </div>
      </Link>

      {/* Search box */}
      <form
        className={styles.searchContainer}
        onSubmit={handleSearchSubmit}
        ref={suggestionsRef}
      >
        <div className={styles.searchBox} dir="rtl">
          <input
            type="text"
            placeholder="در کیمیاترنج جستجو کنید ..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              if (suggestions.length) setShowSuggestions(true);
            }}
          />
          <button type="submit" className={styles.searchButton}>
            <IoSearch className={styles.searchIcon} />
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((prod) => (
              <li
                key={prod.id}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(prod)}
              >
                <div className={styles.suggestionImage}>
                  <img src={prod.images[0].image} alt={prod.title} />
                </div>
                <div className={styles.suggestionText}>
                  <div className={styles.suggestionTitle}>{prod.title}</div>
                  <div className={styles.suggestionMeta}>
                    {prod.collection?.title} •{" "}
                    {formatPrice(prod.variants?.[0]?.price.toLocaleString())}{" "}
                    تومان
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Hamburger toggle */}
      {!isMenuOpen && (
        <div className={styles.hamburgerContainer}>
          <button
            className={styles.hamburgerButton}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Navigation menu"
          >
            <IoMenu size={44} color="#002147" />
          </button>
        </div>
      )}

      {/* Sliding menu panel */}
      {isMenuOpen && (
        <div className={styles.menuOverlay}>
          <div className={styles.menuPanel} ref={menuRef}>
            <button
              className={styles.closeButton}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <IoClose size={28} color="#023047" />
            </button>
            <ul className={styles.menuList}>
              <li className={styles.menuItem}>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  صفحه اصلی
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                  درباره ما
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/agent" onClick={() => setIsMenuOpen(false)}>
                  اخذ نمایندگی
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/blog" onClick={() => setIsMenuOpen(false)}>
                  مقالات
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/gift-selector" onClick={() => setIsMenuOpen(false)}>
                  کادو چی بخرم؟
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/faq" onClick={() => setIsMenuOpen(false)}>
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderMobile;
