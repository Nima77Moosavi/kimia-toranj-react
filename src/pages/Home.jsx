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

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/store/products/"
      );
      setLatestProducts(response.data);
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className={styles.home}>
      <Header />
      <div className={styles.content}>
        {/* <h2>Welcome to My Brand</h2>
        <p>This is the home page. Highlights will be displayed here.</p> */}
        <Highlights /> {/* Add the Highlights component here */}
        <Collections />

        <Bestsellers/>
        <SpecialOffer/>
        <SpecialProducts/>
        <Footer/>
        {/* <ProductList products={latestProducts} /> */}
      </div>
    </div>
  );
};

export default Home;
