import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./InstallmentPayment.module.css";

const getInstallmentMonths = (price) => {
  const priceMillion = price / 1000000;
  if (priceMillion >= 5 && priceMillion < 10) return 1;
  if (priceMillion >= 10 && priceMillion < 20) return 2;
  if (priceMillion >= 20 && priceMillion < 30) return 3;
  if (priceMillion >= 30 && priceMillion < 40) return 4;
  if (priceMillion >= 40 && priceMillion < 50) return 5;
  if (priceMillion >= 50 && priceMillion <= 60) return 6;
  return null;
};

const InstallmentPayment = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const price = Number(params.get("price")) || 0;

  const months = getInstallmentMonths(price);
  const upfront = Math.round(price * 0.3);
  const remaining = price - upfront;
  const monthly = months ? Math.round(remaining / months) : null;

  return (
    <>
      <Header />
      <div className={styles.installmentContainer}>
        <h2>پرداخت اقساطی محصولات صنایع‌دستی</h2>
        <div className={styles.summaryBox}>
          <div className={styles.summaryRow}>
            <span>قیمت کل محصول:</span>
            <strong>{price.toLocaleString()} تومان</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>مبلغ پیش‌پرداخت (۳۰٪):</span>
            <strong className={styles.upfront}>{upfront.toLocaleString()} تومان</strong>
          </div>
          {months ? (
            <>
              <div className={styles.summaryRow}>
                <span>تعداد اقساط:</span>
                <strong>{months} ماه</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>مبلغ هر قسط:</span>
                <strong>{monthly.toLocaleString()} تومان</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>مبلغ باقی‌مانده (قسطی):</span>
                <strong>{remaining.toLocaleString()} تومان</strong>
              </div>
            </>
          ) : (
            <div className={styles.summaryRow}>
              <span>شرایط اقساطی:</span>
              <strong>این مبلغ برای پرداخت اقساطی تعریف نشده است.</strong>
            </div>
          )}
        </div>
        <div className={styles.infoSection}>
          <h3>شرایط پرداخت اقساطی</h3>
          <ul>
            <li>۳۰٪ مبلغ کل به عنوان پیش‌پرداخت دریافت می‌شود.</li>
            <li>باقی‌مانده مبلغ طی {months || "—"} ماه به صورت اقساط پرداخت می‌شود.</li>
            <li>برای ثبت درخواست پرداخت اقساطی، با پشتیبانی تماس بگیرید.</li>
          </ul>
        </div>
        <div className={styles.supportBox}>
          <span>پشتیبانی و ثبت درخواست:</span>
          <a
            href="https://wa.me/989130095238"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.supportBtn}
          >
            گفتگوی واتساپ
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InstallmentPayment;
