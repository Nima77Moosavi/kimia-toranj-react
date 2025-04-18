import React from "react";
import styles from "./ReviewsList.module.css";

const ReviewsList = () => {
  const reviews = [
    { id: 1, product: "محصول ۱", comment: "بسیار عالی بود!" },
    { id: 2, product: "محصول ۲", comment: "کیفیت مناسب بود." },
  ];

  return (
    <div className={styles.reviews}>
      <h3>دیدگاه‌های شما</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>محصول:</strong> {review.product} <br />
            <strong>دیدگاه:</strong> {review.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsList;
