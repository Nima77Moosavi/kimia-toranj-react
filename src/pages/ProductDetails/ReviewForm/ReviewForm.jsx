// src/components/ReviewForm/ReviewForm.jsx
import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_URL } from "../../../config";
import styles from "./ReviewForm.module.css";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ productId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (rating === 0) {
      setError("لطفا امتیاز دهید");
      return;
    }
    if (!comment.trim()) {
      setError("لطفا نظر خود را بنویسید");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post(`${API_URL}api/store/reviews/`, {
        product: productId,
        content: comment,
        rating: rating,
      });
      setSuccess(true);
      setComment("");
      setRating(0);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("خطا در ارسال نظر");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.compactContainer}>
      <h4 className={styles.compactTitle}>ثبت نظر</h4>

      <form onSubmit={handleSubmit} className={styles.compactForm}>
        <div className={styles.compactRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`${styles.compactStar} ${
                star <= (hoverRating || rating) ? styles.compactFilled : ""
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <FaStar className={styles.icon} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="نظر شما..."
          className={styles.compactTextarea}
          rows={3}
        />

        <div className={styles.compactFooter}>
          {error && <span className={styles.compactError}>{error}</span>}
          {success && (
            <span className={styles.compactSuccess}>✓ نظر شما ثبت شد</span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.compactButton}
          >
            {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
