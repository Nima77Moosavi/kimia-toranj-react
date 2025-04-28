import { React, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./productDetails.module.css";
import Header from "../../components/Header/Header";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoShareSocialSharp } from "react-icons/io5";
import Bestsellers from "../../components/Bestsellers/Bestsellers";
import Footer from "../../components/Footer/Footer"


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [like, setLike] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const reviewsContainerRef = useRef(null);

  const sampleReviews = [
    { user: "علی", comment: "محصول فوق‌العاده‌ای بود، خیلی راضیم." },
    { user: "زهرا", comment: "بسته‌بندی تمیز و ارسال سریع، ممنون." },
    { user: "محمد", comment: "کمی با عکس فرق داشت ولی کیفیت خوبی داشت." },
    { user: "فاطمه", comment: "نسبت به قیمتش واقعا عالیه!" },
    { user: "رضا", comment: "اندازه‌اش کوچیک‌تر از چیزی بود که فکر می‌کردم." },
    { user: "سارا", comment: "خیلی شیکه، حتما دوباره خرید می‌کنم." },
    { user: "امیر", comment: "ارسال دیر بود ولی محصول خوبه." },
    { user: "نگار", comment: "رنگش دقیقا همونیه که توی عکس بود." },
    { user: "حسین", comment: "ممنون از خدمات خوبتون، من که راضی بودم." },
    { user: "مریم", comment: "نرم و با کیفیت، حتما پیشنهاد می‌کنم." }
  ];

  // برای ایجاد حلقه بی‌نهایت، نظرات را دو بار تکرار می‌کنیم
  const duplicatedReviews = [...sampleReviews, ...sampleReviews];

  const likeHandler = () => {
    setLike(!like);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://kimiatoranj-api.liara.run/api/store/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (!data.reviews || data.reviews.length === 0) {
          data.reviews = sampleReviews;
        }
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Auto-slide reviews every 2 seconds
  useEffect(() => {
    if (!product.reviews || product.reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => {
        // اگر به آخر نظرات رسیدیم، به اول برگردیم
        if (prev >= product.reviews.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [product.reviews]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className={styles.circle}></div>
      <Header/>

      {/* Image Slider */}
      {product.images && product.images.length > 0 && (
        <div className={styles.sliderContainer}>
          <img
            src={product.images[currentImage].image}
            alt={`product image ${currentImage + 1}`}
            className={styles.sliderImage}
          />
        
            <GrFormNext className={styles.prevButton}
            onClick={() =>
              setCurrentImage((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
              )
            }/>
         
         
            <GrFormPrevious className={styles.nextButton}
            onClick={() =>
              setCurrentImage((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
              )
            }/>
         

          <div className={styles.thumbnailContainer}>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={`thumbnail ${index + 1}`}
                className={`${styles.thumbnail} ${
                  index === currentImage ? styles.activeThumbnail : ""
                }`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Description */}
      <div className={styles.descriptionContainer}>
        <div className={styles.description}>
          <h2 className={styles.title}>
            <span>نام محصول: &nbsp;</span>
            {product.title}
          </h2>
          <p className={styles.descriptionText}>
            <span>توضیحات : &nbsp;</span> {product.description}
          </p>
        </div>

        <div className={styles.attributesContainer}>
          <div className={styles.attributeGroup}>
            <label htmlFor="variantSelect">نوع قلم:</label>
            <select
              id="variantSelect"
              className={styles.selectInput}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedVariant = product.variants.find(
                  (v) => v.id === parseInt(selectedId)
                );
                if (selectedVariant) {
                  console.log("انتخاب شده:", selectedVariant);
                }
              }}
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.attributeGroup}>
            <label htmlFor="quantity">تعداد:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              defaultValue="1"
              className={styles.numberInput}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.addToCart}>افزودن به سبد خرید </button>
        <button className={styles.price}>
          {product.variants[0].price} تومان &nbsp;
        </button>
        <div className={styles.iconsContainer}>
          {like ? (
            <GoHeartFill className={styles.icon} onClick={likeHandler} />
          ) : (
            <GoHeart className={styles.icon} onClick={likeHandler} />
          )}
          <IoShareSocialSharp className={styles.icon} />
        </div>
      </div>

      {/* Reviews Slider */}
      <div className={styles.reviewsContainer} ref={reviewsContainerRef}>
        <h3 className={styles.reviewsTitle}>تجربه خرید مشتریان</h3>
        <div className={styles.reviewsWrapper}>
          <div
            className={styles.reviewsSlider}
            style={{
              transform: `translateX(-${currentReviewIndex * (100 / 5)}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {duplicatedReviews.map((review, index) => (
              <div className={styles.reviewCard} key={index}>
                <p className={styles.reviewText}> {review.comment} </p>
                <p className={styles.reviewAuthor}> {review.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Bestsellers/>
      <Footer/>
    </div>
  );
};

export default ProductDetails;