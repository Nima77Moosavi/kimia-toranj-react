import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./OrganizationalGiftPack.module.css";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";
import axios from "axios";

const OrganizationalGiftPack = () => {
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
        const response = await axios.get(
          `${API_URL}api/store/collections/8`
        );
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title = "خرید پک هدیه سازمانی صنایع دستی | پک خاص شرکتی - کیمیا ترنج";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "پکهای هدیه سازمانی کیمیا ترنج، ترکیبی از هنر و اصالت ایرانی برای مدیران، کارکنان و مشتریان خاص. پک شمعدان، چایخوری، آجیلخوری و... با بستهبندی شکیل و امکان سفارشیسازی.";
    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = "https://kimiatoranj.com/category/organizational-gift-pack";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=پک هدیه سازمانی&page=${page}`
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
    <div className={styles.giftPackPage}>
      <div className={styles.header}>
        <Header />
      </div>
      {/* Product Grid Section */}
      <section className={styles.productGridSection}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>محصولات پک هدیه سازمانی برنجی</h1>
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
            خرید پک هدیه سازمانی صنایعدستی اصفهان، ترکیب هنر و احترام در هدیه
          </h1>
          <p className={styles.heroSubtitle}>
            هدیه‌دادن، زبان احترام و قدردانی است. زمانی که این هدیه از دل فرهنگ و هنر ایرانی آمده باشد، ارزش معنوی آن دوچندان خواهد شد. پک‌های هدیه سازمانی فروشگاه کیمیا ترنج، ترکیبی‌اند از زیبایی، اصالت و کیفیت، طراحی‌شده برای مدیران، سازمان‌ها و برندهایی که به ماندگار بودن روابط کاری خود اهمیت می‌دهند.
            در این دسته‌بندی می‌توانید انواع پک‌های متنوع صنایع‌دستی شامل محصولات برنجی، قلمزنی، چای‌خوری، آجیل‌خوری، شمعدان و دیگر آثار فاخر هنری را مشاهده و انتخاب نمایید.
          </p>
        </div>
        <div className={styles.heroImage}>
          {loading ? (
            <div className={styles.imagePlaceholder}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : (
            <img
              src={collection.image || "/images/organizational-gift-pack.jpg"}
              alt={collection.title || "پک هدیه سازمانی"}
              className={styles.heroImg}
              onError={(e) => {
                e.target.src = "/images/organizational-gift-pack.jpg";
              }}
            />
          )}
        </div>
      </section>

      {/* Product Types Section */}
      <section className={styles.productTypesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            انواع پک‌های هدیه سازمانی در کیمیا ترنج
          </h2>
          <div className={styles.productTypesGrid}>
            <div className={styles.productTypeCard}>
              <h3>پک هدیه شمعدان</h3>
              <p>
                شامل شمعدان‌های برنجی یا قلم‌زنی‌شده، همراه با جعبه نفیس. مناسب برای هدایای مدیریتی و رسمی.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <h3>پک چای‌خوری سنتی</h3>
              <p>
                ترکیب سماور کوچک، قوری، استکان نعلبکی یا سینی برنجی، در بسته‌بندی خاص. انتخابی اصیل برای مدیران یا میهمانان ویژه.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <h3>پک آجیل‌خوری یا پذیرایی</h3>
              <p>
                شامل ظرف‌های برنجی یا خاتم‌کاری، در قالبی رسمی و چشم‌نواز. مناسب برای هدیه پایان سال.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <h3>پک ترکیبی صنایع‌دستی</h3>
              <p>
                تلفیقی از چند محصول هنری همچون ترمه، جاقاشقی، نمکدان، یا محصولات قلم‌زنی در یک بسته‌بندی هماهنگ.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <h3>پک‌های سفارشی</h3>
              <p>
                امکان طراحی پک اختصاصی با لوگو، کارت تبریک و بسته‌بندی برندشده برای سازمان‌ها فراهم است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            چرا پک‌های هدیه سازمانی کیمیا ترنج؟
          </h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <h3>هنر اصیل ایرانی</h3>
              <p>تمامی محصولات صنایع‌دستی موجود در پک‌ها، ساخت دست هنرمندان اصفهانی هستند.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>بسته‌بندی شکیل و سازمانی</h3>
              <p>استفاده از جعبه‌های نفیس، بسته‌بندی ایمن و قابلیت درج نشان تجاری سازمان.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>تنوع بالا</h3>
              <p>متناسب با بودجه‌های مختلف و تیراژ متنوع، برای نیازهای سازمان‌های کوچک تا برندهای بزرگ.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>امکان خرید عمده و سفارش ویژه</h3>
              <p>ما امکان تأمین تیراژ بالا با زمان‌بندی دقیق را داریم.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>ارزش‌افزوده برند شما</h3>
              <p>این هدایا نه‌تنها احترام، بلکه هویت فرهنگی برند شما را نیز به مخاطب منتقل می‌کنند.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید پک هدیه سازمانی از کیمیا ترنج
          </h2>
          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>مناسبت هدیه</h3>
              <p>
                برای نوروز، روز معلم، روز کارمند یا مراسم رسمی؟ هر مناسبت نیازمند طراحی متفاوتیست.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>نوع مخاطب</h3>
              <p>
                برای مدیر، مشتری کلیدی یا کارکنان؟ پک‌ها را بر اساس سطح هدیه انتخاب کنید.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>بودجه سازمانی</h3>
              <p>
                ما گزینه‌هایی با قیمت متنوع ارائه می‌دهیم، از پک‌های اقتصادی تا نمونه‌های خاص و لوکس.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>هویت سازمانی</h3>
              <p>
                امکان افزودن لوگو، رنگ برند یا پیام اختصاصی داخل بسته‌ها وجود دارد.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>ارسال و بسته‌بندی</h3>
              <p>
                سفارش‌ها با بسته‌بندی ایمن، زمان‌بندی هماهنگ و ارسال سراسری انجام می‌شوند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            سوالات متداول درباره پک‌های سازمانی
          </h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>پک‌ها قابل سفارشی‌سازی هستند؟</h3>
              <p>
                بله، امکان انتخاب محصول، درج لوگو، کارت تبریک یا طراحی اختصاصی برای شرکت شما وجود دارد.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>حداقل تعداد سفارش چقدر است؟</h3>
              <p>
                حداقل تعداد سفارش برای پک‌های سازمانی معمولاً ۵ عدد است، اما برای سفارش‌های ویژه هماهنگ می‌شود.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>امکان ارسال به چند آدرس وجود دارد؟</h3>
              <p>
                بله، می‌توان سفارش‌های سازمانی را به‌صورت تفکیک‌شده به آدرس‌های مختلف ارسال کرد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>آماده سفارش پک هدیه سازمانی هستید؟</h2>
            <p>مجموعه کامل پک‌های هدیه سازمانی ما را مشاهده کنید</p>
            <Link
              to="/shop?collection=organizational-gift-pack"
              className={styles.ctaButton}
            >
              مشاهده پک‌ها
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrganizationalGiftPack;