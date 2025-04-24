import React from "react";
import styles from "./WishlistItems.module.css";

const WishlistItems = () => {
  const wishlist = [
    { id: 1, name: "محصول ۱", price: "۲۰۰,۰۰۰ تومان" },
    { id: 2, name: "محصول ۲", price: "۳۰۰,۰۰۰ تومان" },
  ];

  return (
    <div className={styles.wishlist}>
      <h3>محصولات موردعلاقه</h3>
      <ul>
        {wishlist.map((item) => (
          <li key={item.id}>
            {item.name} - قیمت: {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishlistItems;
