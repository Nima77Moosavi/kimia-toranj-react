import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./SilverPlated.module.css";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";
import axios from "axios";

const SilverPlated = () => {
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
        const response = await axios.get(`${API_URL}api/store/collections/2`);
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title =
      "محصولات شبه نقره قلمزنی اصفهان | شیرینی خوری، شکلاتخوری، گلدان و کشکول | کیمیا ترنج";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "کلکسیونی از محصولات شبه نقره قلم زنی اصفهان، شامل شیرینی خوری، کشکول، گلدان و ظروف تزئینی و کاربردی. مناسب هدیه، جهیزیه و دکوراسیون اصیل. خرید مستقیم از فروشگاه کیمیا ترنج.";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=شبه نقره&page=${page}`
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
          <h1 className={styles.sectionTitle}>
            محصولات شبه نقره قلمزنی کیمیا ترنج{" "}
          </h1>
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
            زیبایی و اصالت، درخشش ماندگار بدون هزینه سنگین نقره خالص
          </h2>
          <p className={styles.heroSubtitle}>
            خاتمکاری یکی از زیباترین و ظریفترین هنرهای صنایعدستی ایران است؛
            هنریشبهنقره، انتخابی هوشمندانه برای کسانی است که می خواهند درخشش و
            شکوه نقره را داشته باشند اما دغدغه هزینه بسیار باالی آن را ندارند.
            محصوالت شبه نقره کیمیا ترنج، با هنر قلم زنی دستساز، ترکیبی از جلوه
            لوکس و ماندگاری باال را ارائه می کند.
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
            تنوع محصوالت شبه نقره در کیمیا ترنج
          </h2>
          {/* <p className={styles.sectionSubtitle}>
            ما در فروشگاه کیمیا ترنج تنوع کاملی از محصولات خاتمکاری را با سلیقه
            های مختلف آماده کردهایم:
          </p> */}

          <div className={styles.productTypesGrid}>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>سنتی</span>
              </div> */}
              <h3>گلدان شبه نقره</h3>
              <p>
                همراهی هنر قلم زنی با فرم های کالسیک گلدان، این محصولات را به
                المانی لوکس برای میزها و کنسول ها تبدیل کرده است.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>برقی</span>
              </div> */}
              <h3>شیرینی خوری شبه نقره</h3>
              <p>
                از پذیرایی رسمی تا دورهمی های خانوادگی، شیرینی خوریهای سه پایه
                یا دسته دار با طرح های گل و مرغ، جلوه ای چشمنواز به مهمانی های
                شما می بخشند
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>قلمزنی</span>
              </div> */}
              <h3>شکلات خوری شبه نقره</h3>
              <p>
                با درب گنبدی شکل یا بدون درب، این ظروف هم به عنوان پذیرایی و هم
                شیء تزئینی ارزشمند شناخته می شوند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>کشکول شبه نقره</h3>
              <p>
                کشکول های قلم زنی شده، انتخابی متفاوت برای سرو آجیل یا استفاده
                به عنوان المان خاص در دکوراسیون سالن.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>تنگ و نیم ست پذیرایی شبه نقره</h3>
              <p>
                تنگ های قلم زنی شده همراه با لیوان یا گلدان هم سبک، ست جذابی
                برای جهیزیه یا هدیه ایجاد می کند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            چرا محصولات شبه نقره کیمیا ترنج ارزش خرید دارند؟
          </h2>
          {/* <p className={styles.sectionSubtitle}>
            انتخاب آینه و شمعدان صنایع دستی، فقط یک خرید تزئینی نیست؛ بلکه تجلی
            احترام به هنر ایرانی و زیبایی ماندگار است. ویژگیهای این محصوالت:
          </p> */}

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کیفیت</span>
              </div> */}
              {/* <h3>قیمت مناسب تر از نقره خالص</h3> */}
              <p> قیمت مناسب تر از نقره خالص بدون کاهش چشمگیر در جلوه بصری.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>گرما</span>
              </div> */}
              {/* <h3>هنر دست :</h3> */}
              <p>
                هنر قلمزنی اصیل روی بدنه مس یا فلز مرغوب با آبکاری شبه نقره.
              </p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>دوام</span>
              </div> */}
              {/* <h3>دوام بالا :</h3> */}
              <p>تنوع فرم و کاربرد از ظرف پذیرایی تا دکوری خاص</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              {/* <h3>نماد فرهنگ ایرانی :</h3> */}
              <p>
                دوام آبکاری در صورت نگهداری صحیح، تا سالها درخشش خود را حفظ می
                کند.
              </p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              {/* <h3>نماد فرهنگ ایرانی :</h3> */}
              <p>بسته بندی ایمن و مناسب هدیه برای ارسال به سراسر کشور.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            کاربرد محصولات شبه نقره در خانه و مراسم
          </h2>
          <div className={styles.decorationContent}>
            <p>پذیرایی مجلل در مهمانی ها با سرو شیرینی، شکالت یا آجیل.</p>
          </div>
          <div className={styles.decorationContent}>
            <p> استفاده به عنوان المان دکوری روی میز پذیرایی، بوفه یا کنسول.</p>
          </div>
          <div className={styles.decorationContent}>
            <p>
              هدایای رسمی یا شخصی که هم ارزش هنری دارد و هم یادگاری ماندگار است.
            </p>
          </div>
          <div className={styles.decorationContent}>
            <p>افزودن جلوه سنتی به خانه با کمترین تغییر در مبلمان و هزینه.</p>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید محصولات شبه نقره – مشاوره انتخاب هوشمندانه
          </h2>
          {/* <p className={styles.sectionSubtitle}>
            برای خریدی مطمئن و آگاهانه، به نکات زیر توجه داشته باشید:
          </p> */}

          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>انتخاب براساس کاربری</h3>
              <p>
                اگر به دنبال پذیرایی هستید، شیرینی خوری، شکالت خوری و کشکول
                بهترین گزینه اند.
              </p>
              <p>
                اگر صرفاً جنبه تزئینی مدنظر است، گلدان و تنگ های قلم زنی جلوه
                بیشتری ایجاد می کنند.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>اندازه و ابعاد</h3>
              <p>ظروف کوچک و متوسط برای میز پذیرایی مناسبترند.</p>
              <p>
                مدلهای بزرگ یا کشکول های خاص برای بوفه یا میز کنسول ایده آل
                هستند.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>طرح و نقش قلم زنی</h3>
              <p>
                گل و مرغ برای دکور گرم و صمیمی، نقش های اسلیمی و هندسی برای
                فضاهای رسمی.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>بررسی کیفیت آبکاری</h3>{" "}
              <p>رنگ شبه نقره یکنواخت، بدون سایه یا لکه باشد.</p>
              <p>لبه ها و دسته ها بدون خراش یا پوسته شدگی باشند.</p>
            </div>
            <div className={styles.guideItem}>
              <h3> بودجه بندی هوشمندانه</h3>
              <p>
                اگر هدیه می خرید، مدل های متوسط با جعبه شکیل ارزش احساسی و
                اقتصادی خوبی دارند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2>سوالات متداول درباره محصولات شبه نقره</h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>آیا محصولات شبه نقره تغییر رنگ می دهند؟</h3>
              <p>
                در صورت نگهداری صحیح و دوری از رطوبت بالا، سال ها بدون تغییر رنگ
                باقی می مانند.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>آیا می توان شستشو کرد؟</h3>
              <p>بله، اما با دستمال نرم و مرطوب و بدون مواد شیمیایی قوی.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>محصولات ساخت کجاست؟</h3>
              <p>
                تمامی محصولات قلم زنی شبه نقره در اصفهان و به دست هنرمندان
                ایرانی ساخته می شوند.
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

export default SilverPlated;
