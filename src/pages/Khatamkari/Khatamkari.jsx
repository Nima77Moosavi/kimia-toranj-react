import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Khatamkari.module.css";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";
import axios from "axios";

const Khatamkari = () => {
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(true);

  // Infinite scroll product states
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch collection info (title, description, image)
  useEffect(() => {
    const getCollection = async () => {
      try {
        const response = await axios.get(`${API_URL}api/store/collections/8`);
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title = "خاتمکاری اصفهان اصل | خرید اینترنتی از کیمیا ترنج";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "فروش انواع آثار خاتم کاری دست ساز، شامل جعبه، قاب، ست پذیرایی و هدیه های هنری.هنر اصیل ایرانی را از کیمیا ترنج تجربه کنید.ارسال تضمینی";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=خاتم کاری&page=${page}`
        );
        if (!active) return;
        setProducts((prev) =>
          page === 1 ? res.data.results || [] : [...prev, ...res.data.results]
        );
        setHasMore(res.data.next !== null);
      } catch (err) {
        if (active) setProductsError("خطا در دریافت محصولات");
      } finally {
        if (active) setProductsLoading(false);
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, [page]);

  // Infinite scroll observer
  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (productsLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [productsLoading, hasMore]
  );

  return (
    <div className={styles.brassSamovarPage}>
      <div className={styles.header}>
        <Header />
      </div>
      {/* Product Grid Section at the top */}
      <section className={styles.productGridSection}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>محصولات خاتم کاری</h1>
          {products.length === 0 && productsLoading ? (
            <div className={styles.loading}>در حال بارگذاری...</div>
          ) : productsError ? (
            <div className={styles.error}>{productsError}</div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product, i) => {
                const isLast = i === products.length - 1;
                return (
                  <div key={product.id} ref={isLast ? lastProductRef : null}>
                    <ProductCard product={product} />
                  </div>
                );
              })}
              {productsLoading && (
                <div className={styles.loading}>در حال بارگذاری...</div>
              )}
              {!hasMore && products.length > 0 && (
                <div className={styles.endMessage}>
                  هیچ محصول بیشتری موجود نیست
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            خرید محصولات خاتم کاری اصفهان | ترکیب هنر، ظرافت و اصالت
          </h2>
          <p className={styles.heroSubtitle}>
            خاتمکاری یکی از زیباترین و ظریفترین هنرهای صنای عدستی ایران است؛ هنری
            که با کنار هم نشاندن قطعات ریز چوب، فلز و استخوان، آثاری خیرهکننده
            می آفریند. محصولات خاتمکاری، ترکیبی بی نظیر از دقت، صبر و هنر ایرانی
            هستند؛ از جعبه های خاتم گرفته تا قاب آینه، میز، قلمدان و سرویس های
            پذیرایی. در این صفحه، مجموعه ای از نفیس ترین آثار خاتمکاری شده توسط
            هنرمندان اصفهانی را می توانید ببینید و خریداری کنید. آثاری کاربردی،
            تزئینی و ماندگار، مناسب برای هدیه، دکوراسیون و تکمیل جهیزیه.
          </p>
        </div>
        <div className={styles.heroImage}>
          {loading ? (
            <div className={styles.imagePlaceholder}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : (
            <img
              src={collection.image || "/images/handmade-samovar-brass.jpg"}
              alt={collection.title || "خاتم کاری"}
              className={styles.heroImg}
              onError={(e) => {
                e.target.src = "/images/handmade-samovar-brass.jpg";
              }}
            />
          )}
        </div>
      </section>

      {/* Introduction Section */}
      {/* <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introContent}>
            <p>
              برنج، فلزی زیبا، مقاوم و براق است که از دیرباز در ساخت ظروف
              پذیرایی به کار می رفته. سماور برنجی علاوه بر عملکرد بسیار خوب در
              گرم نگه داشتن آب، بهدلیل طراحی سنتی و بدنه ای چشمنواز، انتخابی
              لوکس برای دکور خانه یا محل کار نیز به شمار می آید.
            </p>
            <p>
              در این صفحه می توانید بهترین مدل های سماور برنجی زغالی، برقی،
              تزئینی و کاربردی را مشاهده و خریداری کنید؛ محصولاتی که با دقت بالا
              ساخته شده اند و بعضا هنرهای دستی دیگری مثل قلمزنی یا میناکاری را
              هم در خود جای داده اند.
            </p>
          </div>
        </div>
      </section> */}

      {/* Product Types Section */}
      <section className={styles.productTypesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            انواع محصولات خاتم کاری موجود در فروشگاه کیمیا ترنج
          </h2>
          <p className={styles.sectionSubtitle}>
            ما در فروشگاه کیمیا ترنج تنوع کاملی از محصولات خاتمکاری را با سلیقه
            های مختلف آماده کردهایم:
          </p>

          <div className={styles.productTypesGrid}>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>سنتی</span>
              </div> */}
              <h3>جعبه های خاتمکاری</h3>
              <p>برای جواهرات، قرآن، چای، و یا هدیه. ترکیبی از هنر و کارایی.</p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>برقی</span>
              </div> */}
              <h3>آینه و شمعدان خاتم</h3>
              <p>
                مناسب سفره عقد یا دکوراسیون سنتی با جلوهای هنرمندانه و اصیل.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>قلمزنی</span>
              </div> */}
              <h3>ست های پذیرایی خاتمکاری</h3>
              <p>شامل سینی، قندان، شکالتخوری و سایر ظروف، زیبا و بادوام.</p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>قاب و تابلو خاتم</h3>
              <p>
                قاب های خوشنویسی، تزئین شده با خاتم، مناسب دفاتر رسمی و منازل
                کالسیک.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            ویژگیها و مزایای خاتمکاری اصیل ایرانی
          </h2>
          {/* <p className={styles.sectionSubtitle}>
            انتخاب آینه و شمعدان صنایع دستی، فقط یک خرید تزئینی نیست؛ بلکه تجلی
            احترام به هنر ایرانی و زیبایی ماندگار است. ویژگیهای این محصولات:
          </p> */}

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کیفیت</span>
              </div> */}
              <h3>ظرافت بی نظیر :</h3>
              <p>استفاده از قطعات ریز چوب، فلز و استخوان با نظم هندسی دقیق.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>گرما</span>
              </div> */}
              <h3>هنر دست :</h3>
              <p>تمام مراحل با دستان هنرمندان خبره انجام می شود.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>دوام</span>
              </div> */}
              <h3>دوام بالا :</h3>
              <p>
                با رعایت نکات نگهداری، محصولات خاتم کاری سال ها ماندگار می
                مانند.
              </p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              <h3>نماد فرهنگ ایرانی :</h3>
              <p>حضور در موزه ها، کاخ ها و خانه های اصیل ایرانی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            خاتمکاری؛ هنر نجیب و درخشان اصفهان
          </h2>
          <div className={styles.decorationContent}>
            <p>
              محصولات خاتمکاری نه فقط برای تزئین، بلکه برای انتقال حس اصالت و
              سنت به محیط زندگی طراحی شده اند. چه برای پذیرایی باشه، چه برای
              ویترین یا هدیه دادن، یک اثر خاتمکاری همیشه حرفی برای گفتن دارد.
              خون هات رو با ظرافت بی زمان خاتم، گرمتر و اصیلتر کن.
            </p>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید خاتمکاری از فروشگاه کیمیا ترنج
          </h2>
          <p className={styles.sectionSubtitle}>
            برای خریدی مطمئن و آگاهانه، به نکات زیر توجه داشته باشید:
          </p>

          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>اندازه و کاربرد :</h3>
              <p>جعبه بزرگ یا کوچک؟ قاب یا ست کامل؟</p>
            </div>

            <div className={styles.guideItem}>
              <h3>طرح و سبک :</h3>
              <p>کلاسیک یا ترکیبی با هنرهای دیگر مثل مینا یا میکرو خاتم؟</p>
            </div>

            <div className={styles.guideItem}>
              <h3>سبک شخصی</h3>
              <p>دنبال طراحی کالسیک هستید یا مدرن و مینیمال؟</p>
            </div>

            <div className={styles.guideItem}>
              <h3>جنس و کیفیت مواد اولیه :</h3>
              <p>هرچه ریزتر و متراکم تر، خاتم باارزش تر است.</p>
            </div>
            <div className={styles.guideItem}>
              <h3>هدیه دادن؟</h3>
              <p>حتما مدله ایی با جعبه و بسته بندی شیک را بررسی کنید.</p>
            </div>
            <div className={styles.guideItem}>
              <h3>ارسال امن و تضمینی :</h3>
              <p>
                تمام محصولات کیمیا ترنج با بسته بندی ایمن و ضمانت اصالت ارسال می
                شوند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>سؤالات متداول درباره خاتمکاری</h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>محصولات خاتمکاری فقط تزئینی هستن؟</h3>
              <p>
                نه لزوما. بسیاری از آن ها کاملا کاربردی هستند (مثلا جعبه چای،
                قندان یا سینی)
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>آیا خاتم کاری پوسته پوسته یا خراب میشه؟</h3>
              <p>
                در صورت نگهداری درست )دوری از رطوبت و ضربه(، بسیار بادوام و
                ماندگار است.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>محصولات شما ساخت ایران هستن؟</h3>
              <p>
                بله. تمامی محصولات خاتمکاری فروشگاه کیمیا ترنج ساخت دست هنرمندان
                اصفهانی هستند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>آماده خرید سماور برنجی هستید؟</h2>
            <p>مجموعه کامل محصولات برنجی ما را مشاهده کنید</p>
            <Link
              to="/shop?collection=brass-samovar"
              className={styles.ctaButton}
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default Khatamkari;
