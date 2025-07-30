// src/components/ProductTabs/ProductTabs.jsx
import { useRef, useEffect } from "react";
import { FaListUl } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { RiRulerLine } from "react-icons/ri";
import { BsQuestionSquare } from "react-icons/bs";
import { LiaComments } from "react-icons/lia";
import styles from "./ProductTabs.module.css";
import { toPersianDigits } from "../../../utils/faDigits";

const ProductTabs = ({
  product,
  activeTab,
  setActiveTab,
  showAllReviews,
  setShowAllReviews,
}) => {
  const specsRef = useRef(null);
  const descriptionRef = useRef(null);
  const dimensionsRef = useRef(null);
  const maintenanceRef = useRef(null);
  const reviewsRef = useRef(null);
  const tabContainerRef = useRef(null);
  const activeButtonRef = useRef(null);

  // Grab the reviews array (may be empty)
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

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
        const el = section.ref.current;
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
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
  }, [setActiveTab]);

  useEffect(() => {
    if (activeButtonRef.current && tabContainerRef.current) {
      const btn = activeButtonRef.current;
      const container = tabContainerRef.current;
      const left = btn.offsetLeft;
      const width = btn.offsetWidth;
      const cw = container.offsetWidth;
      const scrollTo = left - cw / 2 + width / 2;
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [activeTab]);

  const scrollToSection = (ref, tabName) => {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY;
    const off = window.innerWidth <= 768 ? 80 : 120;
    window.scrollTo({ top: top - off, behavior: "smooth" });
    setActiveTab(tabName);
  };

  return (
    <div className={styles.rightContainer}>
      <div className={styles.tabContainer} ref={tabContainerRef}>
        <button
          onClick={() => scrollToSection(specsRef, "specs")}
          className={activeTab === "specs" ? styles.active : ""}
          ref={activeTab === "specs" ? activeButtonRef : null}
        >
          <FaListUl className={styles.icons} /> مشخصات
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
          <RiRulerLine className={styles.icons} /> ابعاد
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
        {/* Specs */}
        <div ref={specsRef} className={styles.specsSection}>
          <h2>
            <FaListUl className={styles.icons} />
            نام محصول
          </h2>
          <p>{product.title}</p>
        </div>

        {/* Description */}
        <div ref={descriptionRef} className={styles.descriptionSection}>
          <h2>
            <MdOutlineDescription className={styles.icons} /> توضیحات
          </h2>
          <p>{product.description}</p>
        </div>

        {/* Dimensions */}
        <div ref={dimensionsRef} className={styles.dimensionsSection}>
          <h2>
            <RiRulerLine className={styles.icons} /> مشخصات
          </h2>
          <ul className={styles.dimensions}>
            {product.variants?.[0]?.attributes?.map((attr) => (
              <li key={attr.id} className={styles.dimensionItem}>
                <span>{attr.attribute}</span>:{" "}
                <span>{toPersianDigits(attr.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Maintenance */}
        <div ref={maintenanceRef} className={styles.maintenanceSection}>
          <h2>
            <BsQuestionSquare className={styles.icons} /> شرایط نگهداری
          </h2>
          <p>{product.warranty}</p>
        </div>

        {/* Reviews */}
        <div ref={reviewsRef} className={styles.reviewsContainer}>
          <h2>
            <LiaComments className={styles.icons} /> دیدگاه مشتریان
          </h2>
          <div className={styles.reviewsWrapper}>
            {reviews
              .slice(0, showAllReviews ? reviews.length : 4)
              .map((review, idx) => (
                <div className={styles.reviewCard} key={review.id || idx}>
                  <p className={styles.reviewText}>{review.content}</p>
                  <p className={styles.reviewAuthor}>{review.user}</p>
                </div>
              ))}
          </div>

          {reviews.length > 4 && !showAllReviews && (
            <button
              className={styles.showMoreButton}
              onClick={() => setShowAllReviews(true)}
            >
              نمایش بیشتر
            </button>
          )}
          {showAllReviews && reviews.length > 4 && (
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
  );
};

export default ProductTabs;
