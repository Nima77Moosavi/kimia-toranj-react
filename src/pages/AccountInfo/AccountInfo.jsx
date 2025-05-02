import React from "react";
import Header from "../../components/Header/Header"; // هدر
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel"; // سایدبار
import UserInfoForm from "../../components/UserInfoForm/UserInfoForm"; // فرم اطلاعات مشتری
import styles from "./AccountInfo.module.css";
import Footer from "../../components/Footer/Footer";

const AccountInfo = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          {/* ارسال به صورت استاتیک activeSection به "accountInfo" برای حفظ حالت active */}
          <SidebarUserPanel activeSection="accountInfo" />
        </aside>
        <div className={styles.content}>
          <UserInfoForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountInfo;
