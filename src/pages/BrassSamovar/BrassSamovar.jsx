import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./BrassSamovar.module.css";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";
import axios from "axios";

const BrassSamovar = () => {
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
        const response = await axios.get(`${API_URL}api/store/collections/6`);
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title = "خرید سماور برنجی سنتی و مدرن";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "انواع سماور برنجی زغالی، برقی و قلم‌زنی‌شده را با ضمانت اصالت از فروشگاه کیمیا ترنج تهیه کنید. تلفیقی از زیبایی، دوام و هنر ایرانی. ارسال سریع از اصفهان.";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=سماور برنجی&page=${page}`
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
          <h1 className={styles.sectionTitle}>محصولات سماور برنجی</h1>
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
          <h1 className={styles.heroTitle}>
            {collection.title ||
              "خرید سماور برنجی سنتی و مدرن | جلوه ای از اصالت ایرانی"}
          </h1>
          <p className={styles.heroSubtitle}>
            {collection.description ||
              "سماور برنجی یکی از نمادهای اصیل فرهنگ چای نوشی در ایران است؛ محصولی که تلفیقی از کاربرد روزمره و هنر دست ساز ایرانی است."}
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
              alt={collection.title || "سماور برنجی دستساز با طرح سنتی"}
              className={styles.heroImg}
              onError={(e) => {
                e.target.src = "/images/handmade-samovar-brass.jpg";
              }}
            />
          )}
        </div>
      </section>

      {/* Introduction Section */}
      <section className={styles.introSection}>
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
      </section>

      {/* Product Types Section */}
      <section className={styles.productTypesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            انواع سماور برنجی موجود در فروشگاه کیمیا ترنج
          </h2>
          <p className={styles.sectionSubtitle}>
            ما مجموعه ای متنوع و دسته‌بندی‌شده از سماورهای برنجی را برای سلیقه
            ها و نیازهای مختلف آماده کرده ایم:
          </p>

          <div className={styles.productTypesGrid}>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>سنتی</span>
              </div>
              <h3>سماور برنجی زغالی سنتی</h3>
              <p>
                انتخابی کلاسیک برای علاقه مندان به روش های سنتی دم آوری چای. این
                مدل ها حس نوستالژیک خانه مادربزرگ را زنده می کنند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>برقی</span>
              </div>
              <h3>سماور برنجی برقی</h3>
              <p>
                ترکیبی از زیبایی سنتی و تکنولوژی مدرن. مناسب برای استفاده راحت و
                روزمره در آشپزخانه‌های امروزی.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>قلمزنی</span>
              </div>
              <h3>سماور برنجی با طرح قلمزنی</h3>
              <p>
                نمونه هایی هنرمندانه که توسط هنرمندان اصفهانی تزئین شده اند؛
                گزینه ای بی نظیر برای هدیه یا دکور.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div>
              <h3>ست چای خوری برنجی</h3>
              <p>
                شامل سماور، قوری، سینی و استکان نعلبکی هم سبک؛ مناسب جهیزیه یا
                پذیرایی های خاص.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            ویژگی ها و مزایای سماور برنجی اصل
          </h2>
          <p className={styles.sectionSubtitle}>
            انتخاب سماور برنجی صرفا یک خرید نیست، بلکه یک سرمایه گذاری در زیبایی
            و ماندگاری است.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <span className={styles.iconText}>کیفیت</span>
              </div>
              <h3>جنس فلز خالص</h3>
              <p>
                بدنه از آلیاژ برنج خالص ساخته شده و معمولاً با روکش ضدکدر شدن
                محافظت می شود.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <span className={styles.iconText}>گرما</span>
              </div>
              <h3>رسانای حرارتی عالی</h3>
              <p>
                برنج گرما را به خوبی منتقل می کند، بنابراین سماور در مصرف انرژی
                بهینه تر عمل می‌کند.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <span className={styles.iconText}>دوام</span>
              </div>
              <h3>طول عمر بالا</h3>
              <p>
                برخلاف سماورهای ارزان قیمت از جنس آلومینیوم یا استیل بی کیفیت،
                سماور برنجی سال ها دوام دارد.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div>
              <h3>قابل استفاده یا تزئینی</h3>
              <p>
                برخی مدل ها کاملاً عملیاتی هستند، درحالی که مدل‌های خاص تر برای
                دکوراسیون داخلی طراحی شده اند.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <span className={styles.iconText}>ایرانی</span>
              </div>
              <h3>ساخت ایران، هنر ایرانی</h3>
              <p>
                بسیاری از این سماورها ساخت دست هنرمندان اصفهانی هستند و هرکدام
                دارای امضای خاص خود می باشند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            سماور برنجی؛ تلفیقی از کاربرد و زیبایی در خانه ایرانی
          </h2>
          <div className={styles.decorationContent}>
            <p>
              اگر دکور خانه‌ات رو به سبک سنتی یا تلفیقی می‌چینی، یک سماور برنجی
              دقیقاً همون قطعه‌ایه که فضا رو تکمیل می‌کنه. این محصولات با فرم
              براق، جزئیات زیبا، و درخشندگی طلایی رنگ شون نه تنها حس گرما و
              صمیمیت می‌دن، بلکه نشون دهنده احترام به هنر و میراث فرهنگی ایران
              هم هستن.
            </p>
            <p>
              چه در اتاق پذیرایی باشه، چه روی اپن آشپزخونه یا در ویترین شیشه‌ای،
              سماور برنجی همیشه جلب توجه می‌کنه و به‌نوعی "امضای سبک زندگی
              ایرانی" محسوب می‌شه.
            </p>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید سماور برنجی از فروشگاه کیمیا ترنج
          </h2>
          <p className={styles.sectionSubtitle}>
            ما در فروشگاه <Link to="/">کیمیا ترنج</Link> تلاش می کنیم تا خریدی
            راحت، مطمئن و آگاهانه برای شما فراهم کنیم.
          </p>

          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>حجم و ظرفیت</h3>
              <p>
                اگر برای استفاده روزمره می‌خواید، مدل های ۳ تا ۵ لیتری
                مناسب‌ترن.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>نوع سوخت</h3>
              <p>
                ترجیح می‌دید زغالی باشه یا برقی؟ هرکدوم مزایای خودشون رو دارن.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>قیمت</h3>
              <p>
                بسته به ضخامت برنج، نوع پرداخت و هنرهای به کاررفته (مثل قلمزنی
                یا میناکاری)، قیمت‌ها متفاوته.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>گارانتی و ارسال</h3>
              <p>
                تمام محصولات با ضمانت اصالت و ارسال سریع از اصفهان ارائه می‌شن.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            سؤالات متداول درباره سماور برنجی
          </h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>آیا سماور برنجی تغییر رنگ می‌ده؟</h3>
              <p>
                بله، فلز برنج در تماس با هوا ممکنه کدر بشه یا لک بگیره. اما با
                محلول های طبیعی یا پولیش مخصوص به راحتی براق می‌شه.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>میتونم از سماور برنجی استفاده روزمره داشته باشم؟</h3>
              <p>
                بله. به خصوص مدل های برقی و ساده تر، کاملاً برای استفاده روزانه
                طراحی شدن. فقط به نگهداری درست نیاز دارن.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>سماورهای شما تولید ایران هستن یا وارداتی؟</h3>
              <p>
                تمام سماورهای ما ساخت ایران هستن و بسیاری از اون ها توسط
                هنرمندان اصفهانی به‌صورت دستی ساخته شده ان.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
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
      </section>

      <Footer />
    </div>
  );
};

export default BrassSamovar;
