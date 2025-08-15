import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./GoldenBrass.module.css";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";
import axios from "axios";

const GoldenBrass = () => {
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
        const response = await axios.get(`${API_URL}api/store/collections/1`);
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title =
      "محصولات زرینه قلم زنی اصفهان | آجیل خوری، شکالت خوری، گلدان و تنگ | کیمیا ترنج";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "مجموعه ای فاخر از محصوالت زرینه قلم زنی اصفهان شامل آجیل خوری، تنگ، گلدان، شیرینی خوری و چراغ تزئینی. مناسب هدیه، جهیزیه و دکوراسیون لوکس. خرید مستقیم از فروشگاه صنایع دستی کیمیا ترنج.";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=زرینه&page=${page}`
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
          <h1 className={styles.sectionTitle}>محصولات زرینه کیمیا ترنج</h1>
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
            ترکیب شکوه طلا با اصالت هنر ایرانی
          </h2>
          <p className={styles.heroSubtitle}>
            زرینه، اوج تلفیق درخشش فلز طالگونه با هنر اصیل قلم زنی ایرانی است.
            هر قطعه حاصل ساعتها کار دست هنرمند اصفهانی است که با دقتی بی نظیر،
            طرح های اسلیمی، گل و مرغ یا نقوش هندسی را روی بدنه فلزی حکاکی کرده و
            سپس با آبکاری طالیی، آن را به اثری ماندگار تبدیل می کند. این ظروف
            تنها ابزار پذیرایی نیستند، بلکه بخشی از خاطره و فرهنگ ایرانی را بر
            میز مهمانی و در ویترین خانه شما می نشانند.
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
            تنوع محصولات زرینه در کیمیا ترنج
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
              <h3>آجیل خوری زرینه</h3>
              <p>
                فرم های پایهدار با کاسه پهن و لبه های قلمزنی، انتخابی ایدهآل
                برای پذیرایی رسمی. مدلهایی مانند آجیل خوری برای سرو حجم متوسط و
                مدلهای چندکاره برای مهمانیهای پرجمعیت مناسب اند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>برقی</span>
              </div> */}
              <h3>شیرینی خوری زرینه</h3>
              <p>
                ظروفی با پایه بلند و بشقاب پهن که چیدمان شیرینی ها را چشمگیرتر
                می کند. طراحی کالسیک همراه با قلم زنی ریز باعث می شود حتی بدون
                محتوا هم چشم نواز باشند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>قلمزنی</span>
              </div> */}
              <h3>شکلات خوری زرینه</h3>
              <p>
                مدلهایی با درب گنبدی نقشدار که هم محتوا را حفظ می کنند و هم جلوه
                ای لوکس به میز پذیرایی می دهند. برای هدیه های خاص بسیار محبوب
                اند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>تنگ زرینه</h3>
              <p>
                از فرم های باریک کشیده تا مدلهای پهنتر، این تنگ ها میتوانند هم
                نقش گلدان را ایفا کنند و هم ظرف سرو نوشیدنیهای مجلسی باشند. در
                ست های کامل پذیرایی اغلب همراه لیوان یا گلدان هم طرح عرضه می
                شوند.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>گلدان زرینه</h3>
              <p>
                مدلهای شکمی و موشکی هر کدام حس و حال متفاوتی دارند. گلدان شکمی،
                حس صمیمیت و اصالت سنتی را منتقل می کند و مدل موشکی به فضا حالتی
                رسمی و مجلل می بخشد.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>چراغ تزئینی زرینه</h3>
              <p>
                عالوه بر تأمین نور مالیم، به عنوان یک المان دکوراتیو فاخر در
                سالن ها، هتل ها و فضای خانه بسیار پر طرفدار است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            چرا محصولات زرینه کیمیا ترنج انتخابی خاص هستند؟
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
              {/* <h3>ظرافت بی نظیر :</h3> */}
              <p>آبکاری طلایی براق با درخشندگی ماندگار حتی در نور کم.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>گرما</span>
              </div> */}
              {/* <h3>هنر دست :</h3> */}
              <p>طرح های دستی منحصر به فرد که مشابه دقیق شان پیدا نمی شود.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>دوام</span>
              </div> */}
              {/* <h3>دوام بالا :</h3> */}
              <p>دوام بالا در برابر خط وخش و تغییر رنگ با مراقبت صحیح.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              {/* <h3>نماد فرهنگ ایرانی :</h3> */}
              <p> قابلیت سفارشی سازی و تهیه ست کامل متناسب با نیاز</p>
            </div>
            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              {/* <h3>نماد فرهنگ ایرانی :</h3> */}
              <p> بسته بندی فاخر و امن برای هدیه دادن بدون دغدغه آسیبدیدگی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            کاربرد محصولات زرینه در دکوراسیون و مراسم
          </h2>
          <div className={styles.decorationContent}>
            <p>ایجاد نقطه کانونی )Point Focal )در ویترین یا میز پذیرایی.</p>
            <p> هماهنگی کامل با چیدمان سبک کلاسیک و مبلمان چوبی یا پارچه مخمل. </p>
            <p>استفاده در مراسم رسمی مانند نامزدی، عقد، سالگرد و افتتاحیه.</p>
            <p>تکمیل ست جهیزیه عروس با ظروف هم طرح پذیرایی.</p>
            <p>دکوراسیون هتل ها، رستورانهای لوکس و تالارهای پذیرایی.</p>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید محصولات زرینه – انتخاب با نگاه حرفهای
          </h2>
          <p className={styles.sectionSubtitle}>
            برای خریدی مطمئن و آگاهانه، به نکات زیر توجه داشته باشید:
          </p>

          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>کاربری را دقیق مشخص کنید</h3>
              <p> پذیرایی: آجیل خوری، شکالتخوری، شیرینی خوری.</p>
              <p> تزئینی: گلدان، تنگ، چراغ تزئینی.</p>
            </div>

            <div className={styles.guideItem}>
              <h3>تناسب اندازه با فضا را بسنجید</h3>
              <p>ظروف بزرگ مناسب میز اصلی یا کنسول هستند.</p>
              <p>مدلهای کوچک تر برای میز جلو مبلی یا بوفه ایده آلاند.</p>
            </div>

            <div className={styles.guideItem}>
              <h3> طرح قلمزنی متناسب با فضا را انتخاب کنید </h3>
              <p>گل و مرغ: برای فضاهای گرم و خانوادگی.</p>
              <p> اسلیمی و هندسی: برای فضاهای رسمی و تشریفاتی.</p>
            </div>

            <div className={styles.guideItem}>
              <h3>به کیفیت آبکاری دقت کنید</h3>
              <p>آبکاری باید یکدست، بدون لکه و درخشنده باشد.</p>
              <p>در نور طبیعی هم باید جلوه زیبایی داشته باشد، نه فقط در نور مصنوعی.</p>
            </div>
            <div className={styles.guideItem}>
              <h3> هماهنگی با سبک دکوراسیون</h3>
              <p> زرینه با مبلمان کالسیک و بوفه چوبی جلوه بیشتری پید ا می کند.</p>
              <p>برای خانه های مدرن، می توان از مدل های ساده تر و مینیمال استفاده کرد.</p>
            </div>
            <div className={styles.guideItem}>
              <h3>بودجه بندی و آینده نگری</h3>
              <p>ابتدا اقالم پرکاربردتر را بخرید و سپس به تکمیل ست بپردازید.</p>
              <p>تهیه ست کامل عالوه بر جلوه یکپارچه، ارزش خرید را نیز بالا می برد.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>سؤالات متداول درباره محصولات زیرینه</h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>آیا محصولات زرینه سنگین اند؟</h3>
              <p>بله، وزن بیشتر معموالً به دلیل استفاده از فلز مرغوب و ضخیم تر است که استحکام و ماندگاری را افزایش می دهد.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>آبکاری طلایی ماندگار است؟</h3>
              <p>در صورت شستوشو با پارچه نرم و عدم استفاده از مواد ساینده، آبکاری سالها درخشش خود را حفظ می کند.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>آیا می توان به صورت ست تهیه کرد؟</h3>
              <p>بله، بسیاری از مدل ها در قالب سرویس کامل شامل چند نوع ظرف هم طرح عرضه می شوند.</p>
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

export default GoldenBrass;
