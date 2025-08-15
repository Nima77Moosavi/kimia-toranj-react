import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Qalamzani.module.css";
import axiosInstanceNoRedirect from "../../utils/axiosInstanceNoRedirect";
import { API_URL } from "../../config";
import ProductCard from "../../components/ProductCard/ProductCard";
import axios from "axios";

const Qalamzani = () => {
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
        const response = await axios.get(`${API_URL}api/store/collections/7`);
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getCollection();
    document.title =
      "محصولات قلمزنی اصفهان | گلدان، شکالت خوری، تنگ و مجمع قلمزنی | کیمیا ترنج";
    const tag = document.querySelector('meta[name="description"]');
    if (tag)
      tag.content =
        "مجموعه ای فاخر از محصولات قلمزنی اصفهان شامل گلدان گل و مرغ، شکلات خوری، تنگ، مجمع و کاسه بشقاب لاله ای. مناسب هدیه، دکوراسیون و مراسم رسمی. خرید مستقیم از فروشگاه صنایع دستی کیمیا ترنج.";
  }, []);

  // Fetch products for this collection with pagination
  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    setProductsError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}api/store/products/?collection=قلمزنی&page=${page}`
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
          <h1 className={styles.sectionTitle}>محصولات قلمزنی کیمیا ترنج</h1>
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
            اصالت هنر فلزکاری اصفهان در نقش و طرحی ماندگار
          </h2>
          <p className={styles.heroSubtitle}>
            قلمزنی یکی از اصیل ترین شاخه های هنر فلزکاری ایران است که با حکاکی
            طرح های اسلیمی، گل و مرغ یا نقوش هندسی روی فلز، اثری ماندگار و
            هنرمندانه خلق می کند. محصولات قلمزنی کیمیا ترنج، نه فقط یک وسیله
            کاربردی، بلکه بخشی از فرهنگ و هنر ایرانی اند که حضورشان، فضایی
            باشکوه و اصیل به خانه و محل کار شما می بخشد.
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
            تنوع محصولات قلمزنی در کیمیا ترنج
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
              <h3>گلدان گل و مرغ</h3>
              <p>
                با نقش های ظریف گل و پرنده، مناسب برای دکوراسیون ایرانی اصیل یا
                تلفیق با فضای مدرن.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>برقی</span>
              </div> */}
              <h3>گلدان قلمزنی</h3>
              <p>
                مدل های بدون نقش گل و مرغ، با نقوش اسلیمی یا هندسی که جلوه ای
                رسمی و سنگین دارند.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>قلمزنی</span>
              </div> */}
              <h3>شکلات خوری موشکی</h3>
              <p>
                فرمی کشیده با درب گنبدی، مناسب برای پذیرایی رسمی و هدیه های
                لوکس.
              </p>
            </div>

            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>شکلات خوری دو پایه</h3>
              <p>
                پایه های ظریف قلمزنی شده که علاوه بر ثبات، به ظرف جلوه ای خاص می
                بخشند.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>شکلات خوری تک پایه</h3>
              <p>مدلی کلاسیک و پرطرفدار برای میز مهمانی یا ویترین</p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>شکلات خوری سیبی</h3>
              <p>
                با طراحی فانتزی شبیه سیب، مناسب برای فضاهای صمیمی تر یا هدیه های
                خاص.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>چایدان قلمزنی</h3>
              <p>
                برای نگهداری چای به شکلی هنری، مناسب ست های کامل پذیرایی سنتی.{" "}
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>تنگ قلمزنی</h3>
              <p>
                از فرم های کشیده تا شکمی، برخی با کاربری گلدان نیز قابل استفاده
                اند
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>مجمع قلمزنی</h3>
              <p>
                ظرفی بزرگ برای سرو یا نمایش شیرینی، آجیل یا حتی استفاده صرفاً
                تزئینی.
              </p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>گزخوری خاص</h3>
              <p>به خصوص برای پذیرایی با گز یا شیرینی های سنتی طراحی شده است</p>
            </div>
            <div className={styles.productTypeCard}>
              {/* <div className={styles.productTypeIcon}>
                <span className={styles.iconText}>ست کامل</span>
              </div> */}
              <h3>کاسه و بشقاب لاله ای</h3>
              <p>
                ست دو تکه مناسب سرو میوه، دسر یا استفاده به عنوان قطعه نمایشی در
                ویترین.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            چرا محصولات قلمزنی کیمیا ترنج ارزش خرید دارند؟
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
              <p>ساخت دست هنرمندان اصفهانی با سال ها تجربه و مهارت.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>گرما</span>
              </div> */}
              {/* <h3>هنر دست :</h3> */}
              <p>تنوع بالا در فرم و کاربرد برای دکوراسیون یا پذیرایی. </p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>دوام</span>
              </div> */}
              {/* <h3>دوام بالا :</h3> */}
              <p>دوام رنگ و نقش در اثر کیفیت بالای فلز و حکاکی.</p>
            </div>

            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              {/* <h3>نماد فرهنگ ایرانی :</h3> */}
              <p>مناسب برای هدیه های رسمی و یادگاری های ماندگار .</p>
            </div>
            <div className={styles.featureItem}>
              {/* <div className={styles.featureIcon}>
                <span className={styles.iconText}>کاربرد</span>
              </div> */}
              {/* <h3>نماد فرهنگ ایرانی :</h3> */}
              <p>امکان تهیه ست کامل برای هماهنگی بیشتر در پذیرایی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoration Section */}
      <section className={styles.decorationSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            کاربرد محصولات قلمزنی در خانه و مراسم رسمی
          </h2>
          <div className={styles.decorationContent}>
            <p>ایجاد جلوه ای فاخر در میز پذیرایی و ویترین</p>
            <p>هدیه ای ارزشمند برای مراسم ازدواج، سالگرد یا افتتاحیه.</p>
            <p>
              استفاده به عنوان نقطه کانونی در فضاهای رسمی مانند هتل و تالار.
            </p>
            <p>القای حس سنتی و اصیل در چیدمان های کالسیک.</p>
          </div>
        </div>
      </section>

      {/* Buying Guide Section */}
      <section className={styles.buyingGuideSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            راهنمای خرید محصولات قلمزنی – انتخاب آگاهانه
          </h2>
          <p className={styles.sectionSubtitle}>
            برای خریدی مطمئن و آگاهانه، به نکات زیر توجه داشته باشید:
          </p>

          <div className={styles.buyingGuideGrid}>
            <div className={styles.guideItem}>
              <h3>کاربری محصول را تعیین کنید</h3>
              <p>
                اگر برای پذیرایی می خرید، شکلاتخوری، مجمع یا گزخوری انتخاب کنید.
              </p>
              <p>برای تزئین، گلدان یا تنگ جلوه بیشتری ایجاد می کند.</p>
            </div>

            <div className={styles.guideItem}>
              <h3> طرح و نقش را با دکور هماهنگ کنید</h3>
              <p> نقش گل و مرغ: گرم و صمیمی.</p>
              <p> اسلیمی و هندسی: رسمی و سنگین.</p>
            </div>

            <div className={styles.guideItem}>
              <h3> به جزییات قلمزنی دقت کنید</h3>
              <p>
                هرچه عمق و ظرافت کار بیشتر باشد، ارزش و ماندگاری آن بالاتر است.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h3> ابعاد مناسب را انتخاب کنید</h3>
              <p>فضای ویترین، میز یا کنسول خود را پیش از خرید در نظر بگیرید.</p>
            </div>
            <div className={styles.guideItem}>
              <h3>به کیفیت فلز توجه کنید</h3>
              <p>
                فلز مرغوب نه تنها نقش را بهتر نمایش می دهد، بلکه در برابر ضربه
                یا تغییر رنگ مقاوم تر است.
              </p>
            </div>
            <div className={styles.guideItem}>
              <h3>هماهنگی با سایر ظروف</h3>
              <p>
                اگر ست کامل ندارید، بهتر است طرح و رنگ محصول جدید با سایر لوازم
                پذیرایی و دکور هماهنگ باشد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            سواالت متداول درباره محصولات قلمزنی
          </h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>آیا محصولات قلمزنی سنگین هستند؟</h3>
              <p>
                بله، وزن معمولا به دلیل استفاده از فلز ضخیم تر و باکیفیت بیشتر
                است که هم ماندگاری بیشتر دارد و هم ثبات ظرف را افزایش می دهد.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>چطور باید محصولات قلمزنی را تمیز کرد؟</h3>
              <p>
                بهتر است از یک پارچه نرم و خشک استفاده کنید. در صورت نیاز به شست
                وشو، از آب ولرم و مواد غیرساینده کمک بگیرید.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>آیا این محصولات قابل استفاده روزمره هستند؟</h3>
              <p>
                بله، ولی برای افزایش طول عمر و حفظ زیبایی، توصیه می شود بیشتر در
                پذیرایی های خاص یا به عنوان دکور استفاده شوند.
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

export default Qalamzani;
