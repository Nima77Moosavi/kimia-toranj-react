import React, { useState } from "react";
import styles from "./ProductSlider.module.css"; // Update the CSS file name if needed

const BASE_URL = "http://127.0.0.1:8000"; // Ensure you set the correct backend URL

const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 5; // Number of products to show at a time

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + productsPerPage >= products.length
        ? 0
        : prevIndex + productsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - productsPerPage < 0
        ? products.length -
          (products.length % productsPerPage || productsPerPage)
        : prevIndex - productsPerPage
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Calculate the total number of slides
  const totalSlides = Math.ceil(products.length / productsPerPage);

  // Get the current products to display
  const currentProducts = products.slice(
    currentIndex,
    currentIndex + productsPerPage
  );

  return (
    <div className={styles.productSlider}>
      <div className={styles.sliderContent}>
        {currentProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img
              src={
                product.images.length > 0
                  ? `${product.images[0].image}`
                  : "/placeholder.jpg"
              }
              alt={product.title}
              className={styles.image}
            />
            <h4 className={styles.title}>{product.title}</h4>
          </div>
        ))}
      </div>

      <div className={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              currentIndex === index * productsPerPage ? styles.activeDot : ""
            }`}
            onClick={() => goToSlide(index * productsPerPage)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
