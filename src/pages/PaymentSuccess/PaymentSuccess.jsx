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

        {/* New info completion notice */}
        <p className={styles.warningText}>
          لطفاً اطلاعات حساب کاربری خود را تکمیل کنید تا در ارسال سفارش شما مشکلی پیش نیاید.
        </p>
        <Link to="/user-panel/account-info" className={`${styles.btn} ${styles.secondaryBtn}`}>
          تکمیل اطلاعات حساب
        </Link>

        {/* Existing orders link */}
        <Link to="/user-panel/orders" className={styles.btn}>
          مشاهده سفارش‌ها
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
