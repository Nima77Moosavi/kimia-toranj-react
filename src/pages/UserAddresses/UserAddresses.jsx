import React from "react";
import AddressList from "../../components/AddressList/AddressList";
import AddressForm from "../../components/AddressForm/AddressForm";
import styles from "./UserAddresses.module.css";

const UserAddresses = () => {
  return (
    <div className={styles.addressesPage}>
      <AddressList />
      <AddressForm />
    </div>
  );
};

export default UserAddresses;
