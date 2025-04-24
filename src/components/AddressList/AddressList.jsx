import React from "react";
import styles from "./AddressList.module.css";

const AddressList = () => {
  const addresses = [
    { id: 1, name: "خانه", details: "تهران، خیابان آزادی، پلاک ۱۰" },
    { id: 2, name: "محل کار", details: "تهران، خیابان انقلاب، پلاک ۲۰" },
  ];

  return (
    <div className={styles.addresses}>
      <h3>آدرس‌های شما</h3>
      <ul>
        {addresses.map((address) => (
          <li key={address.id}>
            <strong>{address.name}</strong>: {address.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressList;
