import React from "react";
import styles from "./Footer.module.css";

import { BsChatTextFill } from "react-icons/bs";
import { IoCallSharp } from "react-icons/io5";
import { AiFillInstagram } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";


const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.adresses}>
        <h2 className={styles.title}>آدرس حضوری</h2>
        <p>شعبه یک: اصفهان, میدان نقش جهان, بازار مسگرها</p>
        <p>شعبه دو: اصفهان, میدان نقش جهان, بازار آفرینش</p>
        <p>شعبه سه: اصفهان, میدان نقش جهان, بازار آفرینش غربی</p>
        <p>دفتر مرکزی: اصفهان, خیابان حکیم, مجتمع حکیم طبقه اول واحد 294</p>
        <p>کارگاه تولیدی: اصفهان, شهرک صنعتی دولت آباد, خیابان شاهین 34</p>
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
        <p>شعبه یک: 03132241443</p>
        <p>شعبه دو: 03132218729</p>
        <p>دفتر مرکزی: 03132120363</p>
      </div>

      <div className={styles.socials}>
        <h2 className={styles.title}> راه های ارتباطی</h2>
        <BsChatTextFill className={styles.icon} />
        <IoCallSharp className={styles.icon} />
        <AiFillInstagram className={styles.icon} />
        <RiWhatsappFill className={styles.icon} />
      </div>
    </div>
  );
};

export default Footer;
