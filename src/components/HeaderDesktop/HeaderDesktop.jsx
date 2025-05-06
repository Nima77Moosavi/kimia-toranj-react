import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "./HeaderDesktop.module.css";
import { IoMenu, IoSearch } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { BsFileEarmarkPerson } from "react-icons/bs";
import { TbDeviceIpadHorizontalStar } from "react-icons/tb";
import { PiArticleBold } from "react-icons/pi";
import { FaTrashAlt } from "react-icons/fa";
import { FavoritesContext } from "../../context/FavoritesContext"; // مسیر درست رو بزن

const HeaderDesktop = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const { favorites, removeFavorite } = useContext(FavoritesContext); // 👈🏻 گرفتن اطلاعات از Context

  const menuRef = useRef();
  const favoritesRef = useRef();

  // بستن منوها هنگام کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        favoritesRef.current &&
        !favoritesRef.current.contains(event.target)
      ) {
        setIsFavoritesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // بستن منو علاقه‌مندی‌ها هنگام اسکرول
    const handleScroll = () => {
      if (isFavoritesOpen) {
        setIsFavoritesOpen(false);
      }
    };
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isFavoritesOpen]);

  // حذف محصول از لیست علاقه‌مندی‌ها
  const handleDeleteFavorite = (id) => {
    removeFavorite(id);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* آیکن‌ها */}
        <div className={styles.icons}>
          <span>
            <FaCartShopping />
          </span>

          <span
            onClick={() => setIsFavoritesOpen((prev) => !prev)}
            className={styles.favoriteIcon}
          >
            <GoHeartFill />
            {/* نمایش تعداد علاقه‌مندی‌ها */}
            {favorites.length > 0 && (
              <span className={styles.favoriteCount}>{favorites.length}</span>
            )}
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
          <span onClick={() => setIsMenuOpen(true)}>
            <IoMenu />
          </span>
        </div>
      </div>

      {/* منوی بازشو همبرگری */}
      {isMenuOpen && (
        <div className={styles.overlay}>
          <div className={styles.menu} ref={menuRef}>
            <ul>
              <Link to="/">
                <li>
                  صفحه اصلی <FiHome />
                </li>
              </Link>
              <Link to="/about">
                <li>
                  درباره کیمیا ترنج <BsFileEarmarkPerson />
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
            </ul>
          </div>
        </div>
      )}

      {/* لیست علاقه‌مندی‌ها */}
      {isFavoritesOpen && (
        <div className={styles.favoritesPopup} ref={favoritesRef}>
          <h5>علاقه‌مندی‌ها</h5>
          {favorites.length === 0 ? (
            <p className={styles.emptyText}>هیچ محصولی اضافه نشده.</p>
          ) : (
            <ul className={styles.favoritesList}>
              {favorites.map((item) => (
                <li key={item.id}>
                  <Link to={`/productDetails/${item.id}`}>{item.title}</Link>
                  <span
                    onClick={() => handleDeleteFavorite(item.id)}
                    className={styles.deleteIcon}
                  >
                    <FaTrashAlt />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );
};

export default HeaderDesktop;
