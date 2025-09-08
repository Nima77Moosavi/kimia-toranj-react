import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./BrassProducts.module.css";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";
import axios from "axios";

const BrassProducts = () => {
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
          `${API_URL}api/store/collections/3`
        );
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title = "محصولات برنجی اصل اصفهان | فروشگاه صنایع دستی کیمیا ترنج";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "مجموعه‌ای از بهترین محصولات برنجی با طراحی سنتی و مدرن، مناسب دکوراسیون، هدیه و جهیزیه. خرید آنلاین از فروشگاه صنایع‌دستی کیمیا ترنج.";
    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = "https://kimiatoranj.com/category/brass-products";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=محصولات برنجی&page=${page}`
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
    <div className={styles.brassProductsPage}>
      <div className={styles.header}>
        <Header />
      </div>
      {/* Product Grid Section */}
      <section className={styles.productGridSection}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>محصولات برنجی کیمیا ترنج</h1>
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
            خرید محصولات برنجی دستساز | درخشش فلز اصیل در هنر ایرانی
          </h2>
          <p className={styles.heroSubtitle}>
            محصولات برنجی، با درخشش طلایی و حس گرم و کلاسیکشان، از دیرباز در خانه‌های ایرانی جایگاه ویژه‌ای داشته‌اند. از سماورهای مجلل و آینه و شمعدان‌های باشکوه گرفته تا ظروف پذیرایی، جعبه‌ها، تندیس‌ها و وسایل دکوراتیو؛ همه و همه گویای ترکیب شگفت‌انگیزی از زیبایی، دوام و هنر اصیل ایرانی هستند.
            
          </p>
        </div>
        <div className={styles.heroImage}>
          {loading ? (
            <div className={styles.imagePlaceholder}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : (
            <img
              src={collection.image || "/images/brass-products.jpg"}
              alt={collection.title || "محصولات برنجی دستساز"}
              className={styles.heroImg}
              onError={(e) => {
                e.target.src = "/images/brass-products.jpg";
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
              در فروشگاه کیمیا ترنج، ما با دقت و وسواس، مجموعه‌ای متنوع از محصولات برنجی دستساز را گردآوری کرده‌ایم؛ محصولاتی که بعضاً با هنرهای مکملی مثل قلمزنی، میناکاری یا خاتمکاری ترکیب شده‌اند تا درخشش و ارزش هنری‌شان دوچندان شود. چه برای هدیه دادن، تکمیل جهیزیه، تزئین فضای سنتی یا مدرن و چه حتی برای استفاده روزمره به دنبال اثری خاص باشید، این دسته‌بندی می‌تواند انتخابی چشمگیر و ماندگار باشد.
            </p>
          </div>
        </div>
      </section>

      {/* Product Types Section */}
      <section className={styles.productTypesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            تنوع محصولات برنجی در کیمیا ترنج
          </h2>
          <p className={styles.sectionSubtitle}>
            ما در کیمیا ترنج مجموعه‌ای از کاربردی‌ترین و خاص‌ترین کالاهای برنجی را برای استفاده روزمره، تزئین منزل، هدیه یا تکمیل جهیزیه فراهم کرده‌ایم. برخی از پرفروش‌ترین موارد عبارتند از:
          </p>
          <div className={styles.productTypesGrid}>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>چراغ برنجی</span>
              </div>
              <h3>چراغ برنجی سنتی</h3>
              <p>
                الهام‌گرفته از طراحی‌های قدیمی ایرانی، مناسب برای دکور سنتی، سفره هفت‌سین یا روشنایی تزئینی با شمع یا روغن.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>شمعدان</span>
              </div>
              <h3>شمعدان برنجی</h3>
              <p>
                در طرح‌های ساده، قلمزنی شده یا ترکیب با چوب و شیشه؛ مناسب میز پذیرایی، سفره عقد یا دکور.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>نمکدان</span>
              </div>
              <h3>نمکدان برنجی</h3>
              <p>
                کوچک و خوش‌ساخت، گاهی با پایه خاتم یا طرح‌های قلمزنی. نمکدان‌هایی خاص برای میز غذاخوری یا چیدمان سنتی.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>آجیل‌خوری</span>
              </div>
              <h3>آجیل‌خوری و پسته‌خوری برنجی</h3>
              <p>
                ظروفی مقاوم و زیبا برای مهمانی‌ها و پذیرایی‌های رسمی. بعضی مدل‌ها با پایه و دسته تزئینی همراه هستند.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>چای‌خوری</span>
              </div>
              <h3>چای‌خوری برنجی</h3>
              <p>
                سینی و قندان برنجی ست‌شده، در ترکیب با استکان نعلبکی‌های سنتی؛ ایده‌آل برای چای عصرانه یا پذیرایی سنتی.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>شیرینی‌خوری</span>
              </div>
              <h3>ظرف شیرینی‌خوری، شکلات‌خوری یا قندان برنجی</h3>
              <p>
                طرح‌هایی با درب، پایه‌دار یا بدون پایه، مناسب برای ویترین، میز مهمان یا حتی کافه‌ها با تم ایرانی.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            چرا محصولات برنجی کیمیا ترنج ارزش خرید دارند؟
          </h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <h3>ساخت دست هنرمندان ایرانی</h3>
              <p>بسیاری از محصولات ما حاصل کارگاه‌های اصیل در اصفهان‌اند.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>جنس باکیفیت</h3>
              <p>از آلیاژ برنج خالص یا ترکیبی با روکش ضدکدر ساخته شده‌اند.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>طراحی کاربردی و چشم‌نواز</h3>
              <p>هم برای استفاده روزمره، هم برای دکور.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>دوام بسیار بالا</h3>
              <p>محصولات برنجی در صورت نگهداری درست، سال‌ها زیبایی خود را حفظ می‌کنند.</p>
            </div>
            <div className={styles.featureItem}>
              <h3>قابل ترکیب با سایر صنایع‌دستی</h3>
              <p>مثل ترمه، خاتم، قلمزنی یا چرمدوزی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            کاربرد محصولات برنجی در دکوراسیون منزل و جهیزیه
          </h2>
          <div className={styles.decorationContent}>
            <p>
              محصولات برنجی نه‌فقط به‌عنوان ظروف یا وسایل کاربردی، بلکه به‌عنوان بخشی از هویت و چیدمان خانه ایرانی شناخته می‌شوند. در سبک‌های سنتی یا تلفیقی، حضور این محصولات حس گرما، صمیمیت و اصالت ایجاد می‌کند.
            </p>
            <ul>
              <li>یک جفت شمعدان برنجی در دو طرف آینه</li>
              <li>نمکدان سنتی روی سفره یا میز</li>
              <li>آجیل‌خوری طلایی رنگ در وسط میز پذیرایی</li>
              <li>چراغ برنجی کنار ویترین یا روی میز کنار تخت</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید محصولات برنجی از فروشگاه کیمیا ترنج
          </h2>
          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>کاربری مورد نظر</h3>
              <p>
                پیش از خرید، مشخص کنید که محصول مورد نظر برای استفاده تزئینی، کاربردی یا مجموعه‌ای از هر دو است. انتخاب میان گزینه‌های تکی یا ست نیز بر اساس همین نیاز انجام می‌شود.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>جنس و کیفیت ساخت</h3>
              <p>
                کیفیت آلیاژ برنج، ضخامت بدنه و نوع پرداخت سطح، نقش مستقیمی در ماندگاری و جلوه ظاهری محصول دارند.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>تزئینات و جزئیات هنری</h3>
              <p>
                بسته به سلیقه خود، می‌توانید میان مدل‌های ساده، صیقلی یا نمونه‌های منقوش به قلمزنی، میناکاری یا ترکیبات چوبی انتخاب نمایید.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>قیمت‌گذاری</h3>
              <p>
                قیمت محصولات بسته به وزن، ابعاد، نوع طراحی، تکنیک ساخت (دستی یا قالبی) و میزان تزئینات هنری متغیر است.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>ارسال و ضمانت اصالت</h3>
              <p>
                کلیه محصولات با بسته‌بندی ایمن و استاندارد از شهر اصفهان ارسال می‌گردند و دارای ضمانت اصالت و سلامت فیزیکی کالا هستند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            سؤالات متداول درباره محصولات برنجی
          </h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>آیا محصولات برنجی تغییر رنگ می‌دهند؟</h3>
              <p>
                بله. اما با پولیش یا مواد تمیزکننده مخصوص، به‌راحتی مثل روز اول درخشان می‌شوند.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>آیا محصولات فقط تزئینی هستند؟</h3>
              <p>
                خیر. بسیاری از ظروف برنجی مثل سماور، سینی یا قندان کاملاً کاربردی هستند.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>همه محصولات ساخت ایران هستند؟</h3>
              <p>
                بله. تمامی آثار فروشگاه کیمیا ترنج، دست‌ساز و ساخت هنرمندان داخلی هستند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>آماده خرید محصولات برنجی هستید؟</h2>
            <p>مجموعه کامل محصولات برنجی ما را مشاهده کنید</p>
            <Link
              to="/shop?collection=محصولات برنجی"
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

export default BrassProducts;