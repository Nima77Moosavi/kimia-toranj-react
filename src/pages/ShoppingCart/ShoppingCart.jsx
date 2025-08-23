import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import styles from "./ShoppingCart.module.css";
import { MdDeleteOutline } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";

const ShoppingCart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${API_URL}api/store/cart/`);
        setCartData(response.data);
      } catch (err) {
        console.error(err);
        setError("خطا در بارگذاری سبد خرید");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const getItemFinalPrice = (item) => {
    const basePrice = item.product_variant?.price || 0;
    const promotions = item.product_variant?.product?.promotions || [];
    if (promotions.length > 0 && promotions[0].discount) {
      const discountPercent = promotions[0].discount;
      return Math.round(basePrice * (1 - discountPercent / 100));
    }
    return basePrice;
  };

  // Update quantity with step & stock validation
  const updateQuantity = async (itemId, newQuantity) => {
    if (!cartData) return;

    const item = cartData.items.find((it) => it.id === itemId);
    if (!item) return;

    const step = item.product_variant?.product?.order_count || 1;
    const availableStock = item.product_variant?.stock || 0;

    // Enforce multiples of step
    if (newQuantity % step !== 0) return;

    // Enforce min and max
    if (newQuantity > availableStock || newQuantity < step) return;

    const updatedItems = cartData.items.map((it) =>
      it.id === itemId
        ? { product_variant_id: it.product_variant.id, quantity: newQuantity }
        : { product_variant_id: it.product_variant.id, quantity: it.quantity }
    );

    // Optimistic UI update
    const updatedLocalItems = cartData.items.map((it) =>
      it.id === itemId ? { ...it, quantity: newQuantity } : it
    );
    setCartData({ ...cartData, items: updatedLocalItems });

    try {
      await axiosInstance.patch(`${API_URL}api/store/cart/`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to update item quantity", err);
    }
  };

  // Always allow removal, even if invalid
  const removeItem = async (itemId) => {
    if (!cartData) return;

    const updatedItems = cartData.items
      .filter((it) => it.id !== itemId)
      .map((it) => ({
        product_variant_id: it.product_variant.id,
        quantity: it.quantity,
      }));

    // Optimistic UI update
    setCartData({
      ...cartData,
      items: cartData.items.filter((it) => it.id !== itemId),
    });

    try {
      await axiosInstance.patch(`${API_URL}api/store/cart/`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const calculateTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce(
      (total, item) => total + getItemFinalPrice(item) * item.quantity,
      0
    );
  };

  const calculateShippingPrice = () => {
    const total = calculateTotal();
    return total < 1000000 ? 80000 : 0;
  };

  const isCartValid = () => {
    if (!cartData?.items) return false;
    return cartData.items.every((item) => {
      const availableStock = item.product_variant?.stock || 0;
      const step = item.product_variant?.product?.order_count || 1;
      return (
        item.quantity <= availableStock &&
        item.quantity >= step &&
        item.quantity % step === 0
      );
    });
  };

  const handleCheckout = () => {
    navigate("/user-panel/checkout");
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartMain}>
        <div className={styles.cartContent}>
          {loading && <p>در حال بارگذاری...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {cartData && cartData.items && cartData.items.length > 0 ? (
            <div>
              <h2 className={styles.cartTitle}>سبد خرید شما</h2>
              <div className={styles.itemsList}>
                {cartData.items.map((item) => {
                  const promotions =
                    item.product_variant?.product?.promotions || [];
                  const hasPromotion =
                    promotions.length > 0 && promotions[0].discount;
                  const discountPercent = hasPromotion
                    ? promotions[0].discount
                    : 0;
                  const basePrice = item.product_variant?.price || 0;
                  const finalPrice = getItemFinalPrice(item);
                  const imageUrl =
                    item.product_variant?.product?.images?.[0]?.image ||
                    "/placeholder.png";
                  const step = item.product_variant?.product?.order_count || 1;

                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        {hasPromotion && (
                          <span className={styles.discountBadge}>
                            {discountPercent}٪ تخفیف
                          </span>
                        )}
                        <img
                          src={imageUrl}
                          alt={
                            item.product_variant?.product?.title ||
                            "Product Image"
                          }
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemTitle}>
                          {item.product_variant?.product?.title ||
                            "Product Name"}
                        </h3>
                        <p className={styles.itemDescription}>
                          {item.product_variant?.product?.description || ""}
                        </p>
                        {hasPromotion ? (
                          <div className={styles.priceWrapper}>
                            <span className={styles.oldPrice}>
                              {basePrice.toLocaleString()} تومان
                            </span>
                            
                            <span className={styles.newPrice}>
                              {finalPrice.toLocaleString()} تومان
                            </span>
                          </div>
                        ) : (
                          <p className={styles.itemPrice}>
                            {basePrice.toLocaleString()} تومان
                          </p>
                        )}

                        <p
                          className={`${styles.itemStock} ${
                            (item.product_variant?.stock || 0) < 3
                              ? styles.lowStock
                              : ""
                          }`}
                        >
                          موجودی: {item.product_variant?.stock || 0} عدد
                          {(item.product_variant?.stock || 0) < 3 &&
                            (item.product_variant?.stock || 0) > 0 &&
                            " (کم موجودی)"}
                        </p>
                        {step > 1 && (
                          <p className={styles.itemStep}>
                            حداقل سفارش: {step} عدد و مضارب آن
                          </p>
                        )}

                        <div className={styles.quantityControl}>
                          <div className={styles.quantityBox}>
                            <button
                              className={`${styles.quantityButton} ${styles.plusButton}`}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + step)
                              }
                              disabled={
                                item.quantity + step >
                                (item.product_variant?.stock || 0)
                              }
                            >
                              <FiPlus />
                            </button>

                            <span className={styles.quantityNumber}>
                              {item.quantity}
                            </span>

                            {item.quantity > step ? (
                              <button
                                className={`${styles.quantityButton} ${styles.minusButton}`}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - step)
                                }
                              >
                                <FiMinus />
                              </button>
                            ) : (
                              <button
                                className={`${styles.quantityButton} ${styles.deleteButton}`}
                                onClick={() => removeItem(item.id)} // ✅ Always works
                              >
                                <MdDeleteOutline />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Section */}
              <div className={styles.cartSummary}>
                {!isCartValid() && (
                  <div className={styles.stockWarning}>
                    ⚠️ برخی از محصولات در سبد خرید شما از موجودی موجود بیشتر
                    هستند یا تعدادشان با حداقل سفارش همخوانی ندارد.
                  </div>
                )}

                <div className={styles.summaryRow}>
                  <span>جمع قیمت محصولات:</span>
                  <span>{calculateTotal().toLocaleString()} تومان</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>هزینه ارسال:</span>
                  <span>
                    {calculateShippingPrice() === 0
                      ? "رایگان"
                      : `${calculateShippingPrice().toLocaleString()} تومان`}
                  </span>
                </div>

                <div className={`${styles.summaryRow} ${styles.totalPayRow}`}>
                  <span>مبلغ نهایی قابل پرداخت:</span>
                  <span>
                    {(
                      calculateTotal() + calculateShippingPrice()
                    ).toLocaleString()}{" "}
                    تومان
                  </span>
                </div>

                <button
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={loading || !isCartValid()}
                >
                  {loading ? "در حال پردازش..." : "ثبت نهایی سفارش"}
                </button>
              </div>
            </div>
          ) : (
            !loading && <p>سبد خرید شما خالی است.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
