import React from "react";
import AddressList from "../../components/AddressList/AddressList";
import AddressForm from "../../components/AddressForm/AddressForm";
import styles from "./UserAddresses.module.css";

const UserAddresses = () => {
  return (
    <div className={styles.addressesPage}>
      <h2>مدیریت آدرس‌ها</h2>
      <AddressList />
      <AddressForm />
    </div>
  );
};

export default UserAddresses;
