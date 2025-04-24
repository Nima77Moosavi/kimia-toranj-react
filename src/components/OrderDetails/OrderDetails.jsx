import React from "react";
import styles from "./OrderDetails.module.css";

const OrderDetails = ({ type }) => {
  const orders = {
    current: [{ id: 1, name: "محصول ۱", date: "1402/01/15" }],
    delivered: [{ id: 2, name: "محصول ۲", date: "1402/01/10" }],
    returned: [{ id: 3, name: "محصول ۳", date: "1402/01/05" }],
  };

  return (
    <div className={styles.details}>
      <h3>
        {type === "current"
          ? "جاری"
          : type === "delivered"
          ? "تحویل شده"
          : "مرجوعی"}
      </h3>
      <ul>
        {orders[type].map((order) => (
          <li key={order.id}>
            {order.name} - تاریخ: {order.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
