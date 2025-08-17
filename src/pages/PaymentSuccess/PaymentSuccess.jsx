import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

  return (
    <div className={styles.successContainer}>
      <div className={styles.card}>
        <h2>✅ پرداخت موفق</h2>
        <p className={styles.message}>
          سفارش شما با موفقیت ایجاد شد.
          {refId && <> کد پیگیری: <strong>{refId}</strong></>}
        </p>
        <p className={styles.subText}>
          می‌توانید جزئیات سفارش خود را در پنل کاربری مشاهده کنید.
        </p>
        <Link to="/user-panel/orders" className={styles.btn}>
          مشاهده سفارش‌ها
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
