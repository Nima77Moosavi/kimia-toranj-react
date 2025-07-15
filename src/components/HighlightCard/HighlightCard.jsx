// HighlightCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./HighlightCard.module.css";

const HighlightCard = ({ highlight }) => (
  <Link to={`/highlight/${highlight.id}`} className={styles.cardLink}>
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <img
            src={highlight.cover_image}
            alt={highlight.title}
            className={styles.image}
          />
        </div>
      </div>
      <h3 className={styles.title}>{highlight.title}</h3>
    </div>
  </Link>
);

export default HighlightCard;
