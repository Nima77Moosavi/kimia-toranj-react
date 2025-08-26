import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./FrameArt.module.css";
import axios from "axios";
import ProductCard from "../../components/ProductCard/ProductCard";
import { API_URL } from "../../config";

const FrameArt = () => {
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
        const response = await axios.get(`${API_URL}api/store/collections/9`);
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title = "قاب و تابلو دست ساز اصفهان | مینیاتور، خاتم، پی وی سی و سیاه قلم | کیمیا ترنج";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "انواع قاب و تابلو هنری شامل مینیاتور، خاتم، پی وی سی، سیاه قلم و آینه کاری. انتخابی اصیل برای دکوراسیون، هدیه و یادگاری ماندگار. خرید مستقیم از فروشگاه صنایع دستی کیمیا ترنج.";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=قاب&page=${page}`
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
    <div className={styles.frameArtPage}>
      <div className={styles.header}>
        <Header />
      </div>
      
      {/* Product Grid Section at the top */}
      <section className={styles.productGridSection}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>قاب و تابلوهای هنری کیمیا ترنج</h1>
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
            قاب و تابلوهای هنری کیمیا ترنج
          </h2>
          <p className={styles.heroSubtitle}>
            قاب و تابلو از دیرباز یکی از مهمترین عناصر دکوراسیون داخلی در ایران بوده‌اند؛ نه فقط برای پوشاندن
            دیوار خالی، بلکه برای روایت یک داستان، نمایش یک هنر یا خلق فضایی صمیمی و فاخر. مجموعه قاب‌های
            کیمیا ترنج، با بهره‌گیری از هنرهای ارزشمند اصفهان مانند مینیاتور، خاتم‌کاری، سیاه قلم و پیویسی
            نقش‌دار، انتخابی هوشمندانه برای کسانی است که می‌خواهند خانه‌شان بازتاب فرهنگ و سلیقه خاصشان
            باشد.
          </p>
        </div>
        <div className={styles.heroImage}>
          {loading ? (
            <div className={styles.imagePlaceholder}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : (
            <img
              src={collection.image || "/images/handmade-frame-art.jpg"}
              alt={collection.title || "قاب و تابلو دستساز"}
              className={styles.heroImg}
              onError={(e) => {
                e.target.src = "/images/handmade-frame-art.jpg";
              }}
            />
          )}
        </div>
      </section>

      {/* Product Types Section */}
      <section className={styles.productTypesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            تنوع قاب و تابلو در کیمیا ترنج
          </h2>

          <div className={styles.productTypesGrid}>
            <div className={styles.productTypeCard}>
              <h3>تابلو مینیاتور</h3>
              <p>
                نمایش زنده‌رنگی نقش‌های سنتی با دقتی ظریف که فضای خانه را پر از رنگ و انرژی می‌کند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <h3>تابلو پیویسی</h3>
              <p>
                قاب‌هایی سبک و مقاوم با طراحی مدرن یا سنتی که حمل و نصب آسان‌تری دارند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <h3>تابلو خاتم دوگل</h3>
              <p>
                ترکیبی از هنر چوب و خاتم‌کاری با نقش‌های گیاهی، مناسب فضای نشیمن یا محل کار.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              <h3>آینه مینیاتور</h3>
              <p>
                آینه با قاب مینیاتوری، هم کاربری کاربردی دارد و هم جلو‌ه‌ای چشم‌گیر روی دیوار ایجاد می‌کند.
              </p>
            </div>
            
            <div className={styles.productTypeCard}>
              <h3>تابلو سیاه قلم</h3>
              <p>
                تصاویر سیاه‌قلمی با جزئیات بالا که جلوه‌ای هنری و موقر به فضا می‌بخشند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            چرا قاب و تابلوی کیمیا ترنج انتخابی ماندگار است؟
          </h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <p>تنوع بالا در سبک و ابعاد برای هر نوع دکور.</p>
            </div>

            <div className={styles.featureItem}>
              <p>ساخت دست هنرمندان اصفهانی با متریال مرغوب.</p>
            </div>

            <div className={styles.featureItem}>
              <p>مقاومت و ماندگاری بالا حتی پس از سال‌ها نصب.</p>
            </div>

            <div className={styles.featureItem}>
              <p>مناسب برای هدیه‌دادن در مناسبت‌های خاص.</p>
            </div>
            
            <div className={styles.featureItem}>
              <p>قابلیت هماهنگی آسان با مبلمان و سایر عناصر دکور.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            کاربرد قاب و تابلو در دکوراسیون
          </h2>
          <div className={styles.decorationContent}>
            <p>نقطه کانونی دیوار در سالن پذیرایی، اتاق یا دفتر کار.</p>
            <p>پوشاندن و زیبا کردن دیوارهای خالی و ساده.</p>
            <p>افزودن هویت، فرهنگ و حس هنری به فضای داخلی.</p>
            <p>تکمیل ست جهیزیه یا تغییر دکوراسیون فصلی.</p>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید قاب و تابلو – انتخاب درست برای دیوار شما
          </h2>
          <p className={styles.sectionSubtitle}>
            برای خریدی مطمئن و آگاهانه، به نکات زیر توجه داشته باشید:
          </p>

          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>ابعاد دیوار را در نظر بگیرید</h3>
              <p>
                برای دیوارهای بزرگ، قاب‌های چندتکه یا سایز بزرگ جلوه بیشتری دارند.
              </p>
              <p>
                در فضاهای کوچک‌تر، قاب ظریف و تیره یا روشن متناسب با نور محیط انتخاب کنید.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3>سبک دکوراسیون را بررسی کنید</h3>
              <p>مینیاتور و خاتم برای فضاهای کلاسیک.</p>
              <p>پیویسی یا طرح‌های ساده‌تر برای چیدمان مدرن.</p>
            </div>

            <div className={styles.guideItem}>
              <h3>رنگ قاب را با محیط هماهنگ کنید</h3>
              <p>قاب روشن برای دیوار تیره و قاب تیره برای دیوار روشن.</p>
              <p>در دکورهای رنگی، هماهنگی با سایه‌های موجود ضروری است.</p>
            </div>

            <div className={styles.guideItem}>
              <h3>کاربری را مشخص کنید</h3>
              <p>صرفاً تزئینی یا ترکیب تزئینی و کاربردی (مثل آینه).</p>
            </div>
            
            <div className={styles.guideItem}>
              <h3>توجه به جزئیات ساخت</h3>
              <p>
                کیفیت نقاشی، ظرافت خاتم‌کاری یا حکاکی نقش زیادی در جلوه نهایی دارد.
              </p>
            </div>
            
            <div className={styles.guideItem}>
              <h3>چینش و ترکیب قاب‌ها</h3>
              <p>
                اگر چند قاب تهیه می‌کنید، پیش از نصب، چینش آنها را روی زمین یا دیوار با ماکت کاغذی
                شبیه‌سازی کنید.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            سوالات متداول درباره قاب و تابلوهای هنری
          </h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>آیا این قاب‌ها سنگین هستند؟</h3>
              <p>
                وزن بسته به متریال متفاوت است. قاب‌های پیویسی سبک‌تر و قاب‌های چوبی خاتم یا سیاه قلم معمولاً
                سنگین‌تر هستند.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>چطور قاب‌ها را تمیز کنیم؟</h3>
              <p>
                از دستمال خشک و نرم استفاده کنید. برای قاب‌های چوبی یا خاتم از مواد شیمیایی قوی خودداری کنید.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>آیا امکان سفارش سایز یا طرح سفارشی وجود دارد؟</h3>
              <p>
                بله، امکان سفارش برخی مدل‌ها در ابعاد و طرح خاص با هماهنگی فروشگاه وجود دارد.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FrameArt;