import React from "react";
import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
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

// 🔹 Extract table into its own component for reuse
const InstallmentTable = () => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>محدوده قیمت (تومان)</th>
          <th>تعداد اقساط</th>
          <th>پیش‌پرداخت</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>۵,۰۰۰,۰۰۰ تا ۱۰,۰۰۰,۰۰۰</td>
          <td>۱ ماه</td>
          <td>۳۰٪</td>
        </tr>
        <tr>
          <td>۱۰,۰۰۰,۰۰۰ تا ۲۰,۰۰۰,۰۰۰</td>
          <td>۲ ماه</td>
          <td>۳۰٪</td>
        </tr>
        <tr>
          <td>۲۰,۰۰۰,۰۰۰ تا ۳۰,۰۰۰,۰۰۰</td>
          <td>۳ ماه</td>
          <td>۳۰٪</td>
        </tr>
        <tr>
          <td>۳۰,۰۰۰,۰۰۰ تا ۴۰,۰۰۰,۰۰۰</td>
          <td>۴ ماه</td>
          <td>۳۰٪</td>
        </tr>
        <tr>
          <td>۴۰,۰۰۰,۰۰۰ تا ۵۰,۰۰۰,۰۰۰</td>
          <td>۵ ماه</td>
          <td>۳۰٪</td>
        </tr>
        <tr>
          <td>۵۰,۰۰۰,۰۰۰ و مبالغ بیشتر</td>
          <td>۶ ماه</td>
          <td>۳۰٪</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const InstallmentPayment = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const price = Number(params.get("price")) || 0;

  const months = getInstallmentMonths(price);
  const upfront = Math.round(price * 0.3);
  const remaining = price - upfront;
  const monthly = months ? Math.round(remaining / months) : null;

  const belowMinimum = price < 5000000;

  return (
    <>
      <Header />
      <div className={styles.installmentContainer}>
        <h2>پرداخت اقساطی محصولات صنایع‌دستی کیمیا ترنج</h2>

        {belowMinimum ? (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              پرداخت اقساطی برای این مبلغ در دسترس نیست .مجموع خرید شما باید
              بیشتر از 5 میلیون تومان باشد
            </h3>
            <p className={styles.cardSubtitle}>
              لطفاً شرایط کلی پرداخت اقساطی را در جدول زیر مشاهده کنید:
            </p>
          </div>
        ) : (
          <>
            <div className={styles.emphasisRow}>
              <div className={styles.emphasisBox}>بدون سود</div>
              <div className={styles.emphasisBox}>بدون ضامن</div>
            </div>

            <div className={styles.totalPriceBox}>
              قیمت کل: <strong>{price.toLocaleString()} تومان</strong>
            </div>

            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>مبلغ پیش‌پرداخت (۳۰٪):</span>
                <strong className={styles.upfront}>
                  {upfront.toLocaleString()} تومان
                </strong>
              </div>
              {months ? (
                <>
                  <div className={styles.summaryRow}>
                    <span>مبلغ باقی‌مانده (قسطی):</span>
                    <strong>{remaining.toLocaleString()} تومان</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>تعداد اقساط:</span>
                    <strong>{months} ماه</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>مبلغ هر قسط:</span>
                    <strong>{monthly.toLocaleString()} تومان</strong>
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
                <li>
                  باقی‌مانده مبلغ طی {months || "—"} ماه به صورت اقساط پرداخت
                  می‌شود.
                </li>
                <li>
                  برای ثبت درخواست پرداخت اقساطی، وارد گفت‌وگوی واتساپ شوید
                </li>
              </ul>
            </div>

            <div className={styles.supportBox}>
              <a
                href="https://wa.me/989130095238"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.supportBtn}
              >
                <FaWhatsapp className={styles.whatsappIcon} /> گفتگوی واتساپ
              </a>
            </div>
          </>
        )}

        {/* 🔹 Always show the table at the bottom */}
        <InstallmentTable />
      </div>
      <Footer />
    </>
  );
};

export default InstallmentPayment;
