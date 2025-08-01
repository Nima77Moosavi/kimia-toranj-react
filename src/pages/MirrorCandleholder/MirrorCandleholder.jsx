import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./MirrorCandleholder.module.css";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";

const MirrorCandleHolder = () => {
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
        const response = await axiosInstanceNoRedirect.get(
          `${API_URL}api/store/collections/10`
        );
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title =
      "خرید آینه و شمعدان سنتی و مدرن | صنایع دستی کیمیا ترنج    ";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "مجموعه ای از آینه و شمعدان های دست ساز با هنر خاتم کاری، قلم زنی و مینا کاری در فروشگاه کیمیا ترنج - انتخابی خاص برای دکور، هدیه و جهیزیه- ارسال از اصفهان";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axiosInstanceNoRedirect.get(
          `${API_URL}api/store/products/?collection=آینه شمعدان&page=${page}`
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
          <h1 className={styles.sectionTitle}>محصولات آینه شمعدان </h1>
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
            {collection.title ||
              "خرید آینه و شمعدان سنتی و مدرن | تبلور زیبایی در هنر ایرانی"}
          </h2>
          <p className={styles.heroSubtitle}>
            آینه و شمعدان یکی از اصیلترین عناصر دکوراسیون ایرانی است؛ محصولی که
            نهتنها یادآور رسوم و سنتهای کهن مثل سفره عقد و جهیزیه است، بلکه با
            طراحیهای امروزیاش، جایگاه ویژهای در دکوراسیون مدرن هم پیدا کرده.
            آینه و شمعدانهای صنایعدستی، تلفیقی هستند از هنرهای اصیلی چون
            خاتمکاری، قلمزنی و میناکاری که توسط استادکاران هنرمند، با دقت و عشق
            ساخته میشوند. در این صفحه، میتوانید مجموعهای خاص و متنوع از آینه و
            شمعدانهای دستساز، تزئینی و کاربردی را ببینید و خریداری کنید؛
            محصوالتی که با متریال مرغوب و طراحی ظریف، زیبایی خیرهکنندهای به
            خانهتان میبخشند.
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
              alt={collection.title || "آینه و شمعدان"}
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
            انواع آینه و شمعدان موجود در فروشگاه کیمیا ترنج
          </h2>
          <p className={styles.sectionSubtitle}>
            ما در فروشگاه کیمیا ترنج، مجموعهای از آینه و شمعدانهای نفیس و دسته
            بندی شده را فراهم کرده ایم:
          </p>

          <div className={styles.productTypesGrid}>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>سنتی</span>
              </div>
              <h3>آینه و شمعدان خاتمکاری</h3>
              <p>
                ترکیبی از هنر چوب، استخوان و فلز که در قاب آینه و پایه شمعدان به
                زیبایی نقش بسته؛ انتخابی فاخر برای جهیزیه و مناسبتهای خاص.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>برقی</span>
              </div>
              <h3>آینه و شمعدان قلمزنی</h3>
              <p>
                فلز براق و طرحهای برجسته دستساز، این مدلها را به شاهکارهایی
                تبدیل کردهاند که میتوانند مرکز توجه هر دکوراسیونی باشند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>قلمزنی</span>
              </div>
              <h3>آینه و شمعدان میناکاری</h3>
              <p>
                رنگهای آبی و لاجوردی با نقوش اسلیمی، در آینه و شمعدانهای
                میناکاری جلوهای خاص ایجاد میکنند؛ ایدهآل برای هدایای لوکس و دکور
                چشم نواز.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div>
              <h3>ستهای کامل آینه و شمعدان با جعبه یا بستهبندی هدیه</h3>
              <p>
                برخی مدل ها همراه با جعبه خاتمکاری یا مخمل عرضه می شوند که برای
                هدیه یا سفره عقد بی نظیر هستند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            ویژگیها و مزایای آینه و شمعدان دست ساز ایرانی
          </h2>
          <p className={styles.sectionSubtitle}>
            انتخاب آینه و شمعدان صنایع دستی، فقط یک خرید تزئینی نیست؛ بلکه تجلی
            احترام به هنر ایرانی و زیبایی ماندگار است. ویژگیهای این محصوالت:
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کیفیت</span>
              </div> */}
              <h3>ساخته شده از متریال مرغوب</h3>
              <p>فلز، چوب، شیشه و هنرهای دستی با بهترین کیفیت اجرا شدهاند.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>گرما</span>
              </div> */}
              <h3>زیبایی سنتی در قالب مدرن</h3>
              <p>ترکیب فرمهای کالسیک با سلیقه امروزی برای فضاهای مختلف.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>دوام</span>
              </div> */}
              <h3>هدیه ای خاص و ماندگار</h3>
              <p>گزینه ای فوق العاده برای هدیه عروسی، سالگرد یا افتتاحیه.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              <h3>اثر هنری منحصر به فرد</h3>
              <p>
                بسیاری از مدل ها دارای امضای استادکار هستند و مشابه آن یافت نمی
                شود.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            آینه و شمعدان؛ روشنایی دل و فضا در خانه ایرانی
          </h2>
          <div className={styles.decorationContent}>
            <p>
              چه بخوای خونهات رو با سبک سنتی بچینی، چه دنبال یک نقطهی کانونی خاص
              برای پذیرایی یا اتاق خواب باشی، آینه و شمعدان صنایعدستی دقیقا همون
              چیزی هستن که فضا رو متحول میکنن. درخشندگی فلز، نور بازتابشده در
              آینه و خطوط هنرمندانه طرحها، ترکیبی ایجاد میکنن که حس صمیمیت و
              اصالت ایرانی رو به زیبایی منتقل میکنه.
            </p>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید آینه و شمعدان از فروشگاه کیمیا ترنج
          </h2>
          <p className={styles.sectionSubtitle}>
            برای خریدی مطمئن و آگاهانه، به نکات زیر توجه داشته باشید:
          </p>

          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>ابعاد و تناسب با فضا</h3>
              <p>
                مدلهای کوچک برای میز توالت یا ویترین مناسبند، درحالیکه مدلهای
                بزرگ برای سفره عقد یا دکور اصلی کاربرد دارند.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>نوع هنر به کاررفته</h3>
              <p>خاتم کاری، مینا، قلمزنی یا ترکیبی از آنها؟</p>
            </div>

            <div className={styles.guideItem}>
              <h3>سبک شخصی</h3>
              <p>دنبال طراحی کالسیک هستید یا مدرن و مینیمال؟</p>
            </div>

            <div className={styles.guideItem}>
              <h3>قیمت و ارزش هنری</h3>
              <p>بسته به متریال و میزان هنر بهکاررفته، قیمتها متغیرند.</p>
            </div>
            <div className={styles.guideItem}>
              <h3>ارسال و بستهبندی</h3>
              <p>
                همه محصولات با ضمانت سلامت، ارسال مطمئن و بسته بندی ویژه عرضه می
                شوند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            سؤاالت متداول درباره آینه و شمعدان صنایع دستی
          </h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>
                آیا آینه و شمعدانهای شما قابل استفاده هستند یا فقط تزئینی اند؟
              </h3>
              <p>
                هر دو نوع موجود است؛ برخی فقط برای دکور طراحی شده اند، اما
                بسیاری از مدلها کاملا قابل استفاده در سفره عقد، اتاق خواب یا میز
                پذیرایی هستند.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>امکان سفارشیسازی محصول وجود دارد؟</h3>
              <p>
                بله. میتوانید مدلهای خاص را با ابعاد یا طرح دلخواه سفارش دهید.
                برای این مورد با پشتیبانی تماس بگیرید.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>آیا این محصوالت ساخت ایران هستند؟</h3>
              <p>
                بله. تمام آینه و شمعدانهای موجود در فروشگاه کیمیا ترنج ساخت
                ایران و حاصل هنر استادکاران اصفهانی هستند.
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

export default MirrorCandleHolder;
