import React, {useState} from "react";
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {
  const [activeLink, setActiveLink] = useState("current");

  return (
    <div className="order-list">
      <a
        href="/current"
        className={activeLink === "current" ? "link active" : "link"}
        onClick={() => setActiveLink("current")}
      >
        جاری
      </a>
      <a
        href="/sent"
        className={activeLink === "sent" ? "link active" : "link"}
        onClick={() => setActiveLink("sent")}
      >
        ارسال شده
      </a>
      <a
        href="/returned"
        className={activeLink === "returned" ? "link active" : "link"}
        onClick={() => setActiveLink("returned")}
      >
        مرجوعی
      </a>
    </div>
  );
};

export default OrderDetails;
