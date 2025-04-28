import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Highlights from "../components/Highlights/Highlights"; // Import the Highlights component
import Collections from "../components/Collections/Collections";
import styles from "./Home.module.css";
import axios from "axios";
import Bestsellers from "../components/Bestsellers/Bestsellers";
import SpecialOffer from "../components/SpecialOffer/SpecialOffer";
import SpecialProducts from "../components/SpecialProducts/SpecialProducts";
import Footer from "../components/Footer/Footer";
import HomePageHeader from "../components/HomePageHeader/HomePageHeader";

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      const response = await axios.get(
        "https://kimiatoranj-api.liara.run/api/store/products/"
      );
      setLatestProducts(response.data);
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.circle}></div>
      
      <Header />
      <HomePageHeader/>
      <div className={styles.content}>
        <Highlights /> 
        <Collections />

        <Bestsellers/>
        <SpecialOffer/>
        <SpecialProducts/>
        {/* <ProductList products={latestProducts} /> */}
      </div>
        <Footer/>
    </div>
  );
};

export default Home;
