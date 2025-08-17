import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import styles from "./PaymentFailure.module.css";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const errorMsg = searchParams.get("error");

  return (
    <div className={styles.failureContainer}>
      <div className={styles.card}>
        <h2>❌ پرداخت ناموفق</h2>
        <p className={styles.message}>
          متأسفانه پرداخت شما انجام نشد.
        </p>
        {errorMsg && (
          <p className={styles.errorDetail}>
            خطا: {decodeURIComponent(errorMsg)}
          </p>
        )}
        <p className={styles.subText}>
          اگر وجهی از حساب شما کسر شده، ممکن است طی ۷۲ ساعت کاری بازگردد.
        </p>
        <Link to="/checkout" className={styles.btn}>
          تلاش مجدد
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;
