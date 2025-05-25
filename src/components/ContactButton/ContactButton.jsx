import React, { useState } from "react";
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import styles from "./ContactButton.module.css";

const ContactButton = () => {
  const [open, setOpen] = useState(false);

  const toggleOptions = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className={`${styles.contactContainer} ${open ? styles.open : ""}`}>
      <button className={styles.contactMainButton} onClick={toggleOptions}>
        <span>تماس با ما</span>
      </button>
      <a
        href="https://t.me/+989130336606"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactOption} ${styles.option1}`}
      >
        <FaTelegramPlane size={22} />
      </a>
      <a
        href="https://wa.me/989130336606"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactOption} ${styles.option2}`}
      >
        <FaWhatsapp size={22} />
      </a>
      <a
        href="tel:989130336606"
        className={`${styles.contactOption} ${styles.option3}`}
      >
        <FaPhoneAlt size={22} />
      </a>
      <a
        href="mailto:nima11moosavi@gmail.com"
        className={`${styles.contactOption} ${styles.option4}`}
      >
        <FaEnvelope size={22} />
      </a>
    </div>
  );
};

export default ContactButton;
