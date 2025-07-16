import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import styles from "./ReviewsList.module.css";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`${API_URL}api/store/reviews/`);
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت دیدگاه‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return <div className={styles.message}>در حال بارگذاری...</div>;
  }
  if (error) {
    return <div className={styles.messageError}>{error}</div>;
  }
  if (!reviews.length) {
    return <div className={styles.message}>دیدگاهی ثبت نشده است.</div>;
  }

  return (
    <div className={styles.reviews}>
      <h3 className={styles.title}>دیدگاه‌های شما</h3>
      <ul className={styles.list}>
        {reviews.map((rev) => (
          <li key={rev.id} className={styles.item}>
            <div>
              <strong>محصول:</strong> {rev.product_title || rev.product}
            </div>
            <div>
              <strong>امتیاز:</strong>{" "}
              <span className={styles.rating}>{rev.rating} ★</span>
            </div>
            <div>
              <strong>دیدگاه:</strong> {rev.content}
            </div>
            <div className={styles.date}>
              {new Date(rev.created_at).toLocaleDateString("fa-IR")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsList;
