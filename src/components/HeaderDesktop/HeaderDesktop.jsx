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
import { FavoritesContext } from "../../context/FavoritesContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import { IoBagOutline } from "react-icons/io5";
import { GoGift } from "react-icons/go";
import image1 from "../../assets/banner1.png";

const HeaderDesktop = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  const menuRef = useRef();
  const favoritesRef = useRef();
  const cartRef = useRef();

  // دریافت سبد خرید از API
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}api/store/cart`);
      setCartItems(response.data?.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };

  // حذف آیتم از سبد خرید
  const handleRemoveItem = async (itemId) => {
    try {
      await axiosInstance.delete(`${API_URL}api/store/cart/items/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // مدیریت باز/بسته شدن پاپ‌آپ سبد خرید
  const toggleCartPopup = async (isOpen) => {
    if (isOpen) {
      await fetchCart();
    }
    setIsCartOpen(isOpen);
  };

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
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // بستن منوها هنگام اسکرول
    const handleScroll = () => {
      setIsFavoritesOpen(false);
      setIsCartOpen(false);
    };
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isFavoritesOpen, isCartOpen]);

  const handleDeleteFavorite = (id) => {
    removeFavorite(id);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* آیکن‌ها */}
        <div className={styles.icons}>
          <Link to="/user-panel/cart">
            <span
              onClick={() => toggleCartPopup(!isCartOpen)}
              className={styles.cartIcon}
            >
              <FaCartShopping />
              {cartItems.length > 0 && (
                <span className={styles.cartCount}>{cartItems.length}</span>
              )}
            </span>
          </Link>
        </div>
        <div className={styles.logoContainer}>
          <img src={image1} alt="کیمیاترنج" className={styles.logo} />
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
                  درباره ما <BsFileEarmarkPerson />
                </li>
              </Link>
              <Link to="/">
                <li>
                  اخذ نمایندگی <TbDeviceIpadHorizontalStar />
                </li>
              </Link>
              <Link to="/shop">
                <li>
                  فروشگاه <IoBagOutline />
                </li>
              </Link>
              <Link to="/blog">
                <li>
                  مقالات <PiArticleBold />
                </li>
              </Link>
              <Link to="/gift-selector">
                <li>
                  کادو چی بخرم <GoGift />
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

      {/* پاپ‌آپ سبد خرید با استایل جدید */}
      {/* {isCartOpen && (
        <div className={styles.cartPopup} ref={cartRef}>
          <h5 className={styles.cartTitle}>سبد خرید شما</h5>
          {cartItems.length === 0 ? (
            <p className={styles.emptyCartText}>سبد خرید شما خالی است</p>
          ) : (
            <div className={styles.cartItemsContainer}>
              {cartItems.map((item) => {
                const imageUrl = item.product_variant?.product?.images?.[0]?.image || '/placeholder-product.png';
                
                return (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemImageContainer}>
                      <img 
                        src={imageUrl} 
                        alt={item.product_variant?.product?.title || "محصول"} 
                        className={styles.cartItemImage}
                      />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <Link 
                        to={`/productDetails/${item.product_variant?.product?.id}`}
                        className={styles.cartItemTitle}
                      >
                        {item.product_variant?.product?.title || "محصول"}
                      </Link>
                      <div className={styles.cartItemPrice}>
                        {item.product_variant?.price?.toLocaleString() || "۰"} تومان
                      </div>
                      <div className={styles.cartItemActions}>
                        <span className={styles.cartItemQuantity}>
                          تعداد: {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className={styles.cartItemDelete}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className={styles.cartSummary}>
                <div className={styles.cartTotal}>
                  <span>جمع کل:</span>
                  <span>
                    {cartItems.reduce(
                      (total, item) => total + (item.product_variant?.price * item.quantity || 0),
                      0
                    ).toLocaleString()} تومان
                  </span>
                </div>
                <Link to="/checkout" className={styles.checkoutButton}>
                  پرداخت و ثبت سفارش
                </Link>
              </div>
            </div>
          )}
        </div>
      )} */}
    </header>
  );
};

export default HeaderDesktop;
