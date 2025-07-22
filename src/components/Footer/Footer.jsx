import React from "react";
import styles from "./Footer.module.css";

import { BsChatTextFill } from "react-icons/bs";
import { IoCallSharp } from "react-icons/io5";
import { AiFillInstagram } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaPhoneAlt,
  FaInstagram,
} from "react-icons/fa";
import EnamadSeal from "../EnamadSeal/EnamadSeal";
import { toPersianDigits } from "../../utils/faDigits";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.adresses}>
        <h2 className={styles.title}>آدرس حضوری</h2>
        <p>شعبه یک: اصفهان, میدان نقش جهان, بازار مسگرها</p>
        <p>شعبه دو: اصفهان, میدان نقش جهان, بازار آفرینش</p>
        <p>شعبه سه: اصفهان, میدان نقش جهان, بازار آفرینش غربی</p>
        <p>دفتر مرکزی: اصفهان, خیابان حکیم, مجتمع حکیم طبقه اول واحد ۲۹۴</p>
        <p>کارگاه تولیدی: روبرو شهرک صنعتی جی، کوچه فروردین، فروردین ۶</p>
      </div>

      <div className={styles.acricles}>
        <h2 className={styles.title}> مقالات برتر</h2>
        <p>نگه داری از سماور زغالی</p>
        <p> آیینه شمعدان طرح نقره چگونه است؟</p>
        <p> سرمایه گذاری روی صنایع دستی</p>
        <p>خاتم کاری اصفهان</p>
      </div>

      <div className={styles.contactUs}>
        <h2 className={styles.title}>تماس با ما</h2>
        <p>شعبه یک: {toPersianDigits("03132241443")}</p>
        <p>شعبه دو: {toPersianDigits("03132218729")}</p>
        <p>شعبه سه: {toPersianDigits("03132244430")}</p>
        <p>دفتر مرکزی: {toPersianDigits("03132120363")}</p>
      </div>

      <div className={styles.socials}>
        <h2 className={styles.title}> راه های ارتباطی</h2>
        <a
          href="https://t.me/+989130095238"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaTelegramPlane size={22} />
        </a>

        <a
          href="https://wa.me/989130095238"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaWhatsapp size={22} />
        </a>

        <a
          href="tel:989920784900"
          className={styles.icon}
        >
          <FaPhoneAlt size={22} />
        </a>

        <a
          href="https://instagram.com/kimia.toranj"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaInstagram size={22} />
        </a>
      </div>
      <div className={styles.enamadWrapper}>
        <EnamadSeal />
      </div>
    </div>
  );
};

export default Footer;
