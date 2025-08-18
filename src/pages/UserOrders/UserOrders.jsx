import React, { useState, useEffect } from "react";
import styles from "./UserOrders.module.css";
import axiosInstance from "../../utils/axiosInstance";

const statusMap = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("api/store/orders/");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("خطا در بارگذاری سفارش‌ها", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className={styles.ordersPage}>
      <h2>سفارش‌های من</h2>

      {loading ? (
        <div className={styles.loading}>در حال بارگذاری...</div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>شما سفارشی ثبت نکرده‌اید.</div>
      ) : (
        <ul className={styles.ordersList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <strong>سفارش #{order.id}</strong>
                  <span className={`${styles.status} ${styles[`status-${order.status}`]}`}>
                    {statusMap[order.status] || order.status}
                  </span>
                </div>
                <div className={styles.meta}>
                  <span>تاریخ: {new Date(order.created_at).toLocaleDateString("fa-IR")}</span>
                  <span>مجموع: {order.total?.toLocaleString()} تومان</span>
                </div>
              </div>

              {expanded[order.id] && (
                <div className={styles.orderDetails}>
                  <div>
                    <strong>آدرس:</strong>{" "}
                    {order.shipping_address_detail
                      ? `${order.shipping_address_detail.state}، ${order.shipping_address_detail.city}، ${order.shipping_address_detail.address}`
                      : "—"}
                  </div>

                  <div>
                    <strong>محصولات:</strong>
                    <ul className={styles.productList}>
                      {order.items?.length > 0 ? (
                        order.items.map((item) => (
                          <li key={item.id} className={styles.productItem}>
                            {item.product_variant?.product?.image && (
                              <img
                                src={item.product_variant.product.image}
                                alt={item.product_variant?.product?.title}
                                className={styles.productThumb}
                              />
                            )}
                            <div>
                              {item.product_variant?.product?.title || "محصول"}
                              {item.product_variant?.variant_display && (
                                <span> ({item.product_variant.variant_display})</span>
                              )}
                              <div className={styles.productMeta}>
                                تعداد: {item.quantity} | قیمت:{" "}
                                {item.price?.toLocaleString()} تومان
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li>—</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.detailsBtn}
                  onClick={() => toggleExpand(order.id)}
                >
                  {expanded[order.id] ? "بستن جزئیات" : "نمایش جزئیات"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
