import { React, useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import Header from "../../components/Header/Header";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoShareSocialSharp } from "react-icons/io5";
import Bestsellers from "../../components/Bestsellers/Bestsellers";
import Footer from "../../components/Footer/Footer";
import MoonLoader from "react-spinners/MoonLoader";
import { FavoritesContext } from "../../context/FavoritesContext";
import { FaListCheck } from "react-icons/fa6";
import { MdOutlineDescription } from "react-icons/md";
import { RiCustomSize } from "react-icons/ri";
import { BsQuestionSquare } from "react-icons/bs";
import { LiaComments } from "react-icons/lia";
import { AiOutlineSafety } from "react-icons/ai";
import { TbShieldStar } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import { BiSolidOffer } from "react-icons/bi";
import { FaStar } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [like, setLike] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");

  const specsRef = useRef(null);
  const descriptionRef = useRef(null);
  const dimensionsRef = useRef(null);
  const maintenanceRef = useRef(null);
  const reviewsRef = useRef(null);
  const tabContainerRef = useRef(null);
  const activeButtonRef = useRef(null);

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
    { user: "مریم", comment: "نرم و با کیفیت، حتما پیشنهاد می‌کنم." },
  ];
  const duplicatedReviews = [...sampleReviews, ...sampleReviews];

  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  const likeHandler = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      setLike(false);
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        image: product.images?.[0]?.image || "",
        price: product.variants?.[0]?.price || "",
      });
      setLike(true);
    }
  };

  useEffect(() => {
    setLike(isFavorite(parseInt(id)));
  }, [id, isFavorite]);

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

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "specs", ref: specsRef },
        { id: "description", ref: descriptionRef },
        { id: "dimensions", ref: dimensionsRef },
        { id: "maintenance", ref: maintenanceRef },
        { id: "reviews", ref: reviewsRef },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 4;

      let currentSection = "specs";

      for (let section of sections) {
        const element = section.ref.current;
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = section.id;
            break;
          }
        }
      }

      setActiveTab(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (activeButtonRef.current && tabContainerRef.current) {
      const button = activeButtonRef.current;
      const container = tabContainerRef.current;

      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;

      const scrollTo = buttonLeft - containerWidth / 2 + buttonWidth / 2;
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [activeTab]);

  const scrollToSection = (ref, tabName) => {
    if (ref.current) {
      const offsetTop =
        ref.current.getBoundingClientRect().top + window.scrollY;
      const offset = window.innerWidth <= 768 ? 80 : 120; // موبایل کمتر، دسکتاپ بیشتر
      window.scrollTo({ top: offsetTop - offset, behavior: "smooth" });
      setActiveTab(tabName);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <MoonLoader color="#023047" />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header />
      <div className={styles.pageContent}>
        <div className={styles.circle}></div>

        {product.images && product.images.length > 0 && (
          <div className={styles.sliderContainer}>
            <img
              src={product.images[currentImage].image}
              alt={`product image ${currentImage + 1}`}
              className={styles.sliderImage}
            />
            <GrFormNext
              className={styles.prevButton}
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? product.images.length - 1 : prev - 1
                )
              }
            />
            <GrFormPrevious
              className={styles.nextButton}
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === product.images.length - 1 ? 0 : prev + 1
                )
              }
            />
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

        <div className={styles.container}>
          <div className={styles.leftSidebar}>
            <div className={styles.priceContainer}>
              <p>
              بازگشت محصول تا 7 روز طبق شرایط مرجوعی
              <AiOutlineSafety className={styles.icon} />
            </p>
            <p>
              گارانتی ضمانت اصالت و سلامت فیزیکی کالا
              <TbShieldStar className={styles.icon} />
            </p>
            <p className={styles.inventory}>
              تنها 2 عدد در انبار باقی مانده
              <BsBoxSeam className={styles.icon} />
            </p>
            <button className={styles.price}>
              {product.variants[0].price} &nbsp; تومان
            </button>
            <button className={styles.addToCart}>افزودن به سبد خرید</button>
            </div>
            
            <div className={styles.iconsContainer}>
              {like ? (
                <GoHeartFill onClick={likeHandler} className={styles.icon} />
              ) : (
                <GoHeart onClick={likeHandler} className={styles.icon} />
              )}
              <IoShareSocialSharp className={styles.icon} />
              <BiSolidOffer className={styles.icon} />
            </div>
            <div className={styles.rateContainer}>
              <div className={styles.rightPart}>
                <p>
                  1<FaStar className={styles.icon} />
                  <progress value={0} max={100} className={styles.progress} />

                </p>
                <p>
                  2<FaStar className={styles.icon} />
                  <progress value={20} max={100} className={styles.progress} />
                </p>
                <p>
                  3<FaStar className={styles.icon} />
                  <progress value={0} max={100} className={styles.progress} />
                </p>
                <p>
                  4<FaStar className={styles.icon} />
                  <progress value={80} max={100} className={styles.progress} />
                </p>
                <p>
                  5<FaStar className={styles.icon} />
                  <progress value={70} max={100} className={styles.progress} />
                </p>
              </div>
              <div className={styles.leftPart}>
                <p>4</p>
                </div>
            </div>
          </div>

          <div className={styles.rightContainer}>
            <div className={styles.tabContainer} ref={tabContainerRef}>
              <button
                onClick={() => scrollToSection(specsRef, "specs")}
                className={activeTab === "specs" ? styles.active : ""}
                ref={activeTab === "specs" ? activeButtonRef : null}
              >
                <FaListCheck className={styles.icons} /> مشخصات
              </button>
              <button
                onClick={() => scrollToSection(descriptionRef, "description")}
                className={activeTab === "description" ? styles.active : ""}
                ref={activeTab === "description" ? activeButtonRef : null}
              >
                <MdOutlineDescription className={styles.icons} /> توضیحات
              </button>
              <button
                onClick={() => scrollToSection(dimensionsRef, "dimensions")}
                className={activeTab === "dimensions" ? styles.active : ""}
                ref={activeTab === "dimensions" ? activeButtonRef : null}
              >
                <RiCustomSize className={styles.icons} /> ابعاد
              </button>
              <button
                onClick={() => scrollToSection(maintenanceRef, "maintenance")}
                className={activeTab === "maintenance" ? styles.active : ""}
                ref={activeTab === "maintenance" ? activeButtonRef : null}
              >
                <BsQuestionSquare className={styles.icons} /> شرایط نگهداری
              </button>
              <button
                onClick={() => scrollToSection(reviewsRef, "reviews")}
                className={activeTab === "reviews" ? styles.active : ""}
                ref={activeTab === "reviews" ? activeButtonRef : null}
              >
                <LiaComments className={styles.icons} /> دیدگاه‌ها
              </button>
            </div>

            <div className={styles.detailsWrapper}>
              <div ref={specsRef} className={styles.specsSection}>
                <h2>
                  <FaListCheck className={styles.icons} /> مشخصات محصول
                </h2>
                <p>مشخصات محصول اینجا نمایش داده می‌شود.</p>
              </div>
              <div ref={descriptionRef} className={styles.descriptionSection}>
                <h2>
                  <MdOutlineDescription className={styles.icons} /> توضیحات
                </h2>
                <p>{product.description}</p>
              </div>
              <div ref={dimensionsRef} className={styles.dimensionsSection}>
                <h2>
                  <RiCustomSize className={styles.icons} /> ابعاد
                </h2>
                <p>ابعاد محصول اینجا نمایش داده می‌شود.</p>
              </div>
              <div ref={maintenanceRef} className={styles.maintenanceSection}>
                <h2>
                  <BsQuestionSquare className={styles.icons} /> شرایط نگهداری
                </h2>
                <p>شرایط نگهداری محصول اینجا نمایش داده می‌شود.</p>
              </div>
              <div ref={reviewsRef} className={styles.reviewsContainer}>
                <h2>
                  <LiaComments className={styles.icons} /> دیدگاه مشتریان
                </h2>
                <div className={styles.reviewsWrapper}>
                  {duplicatedReviews
                    .slice(0, showAllReviews ? duplicatedReviews.length : 4)
                    .map((review, index) => (
                      <div className={styles.reviewCard} key={index}>
                        <p className={styles.reviewText}>{review.comment}</p>
                        <p className={styles.reviewAuthor}>{review.user}</p>
                      </div>
                    ))}
                </div>
                {duplicatedReviews.length > 4 && !showAllReviews && (
                  <button
                    className={styles.showMoreButton}
                    onClick={() => setShowAllReviews(true)}
                  >
                    نمایش بیشتر
                  </button>
                )}
                {showAllReviews && duplicatedReviews.length > 4 && (
                  <button
                    className={styles.showMoreButton}
                    onClick={() => setShowAllReviews(false)}
                  >
                    نمایش کمتر
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Bestsellers />
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;
