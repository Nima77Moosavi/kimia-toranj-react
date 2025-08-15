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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("api/store/orders/");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("خطا در بارگذاری سفارش ها", error);
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
        <div>در حال بارگذاری...</div>
      ) : orders.length === 0 ? (
        <div>شما سفارشی ثبت نکرده‌اید.</div>
      ) : (
        <ul className={styles.ordersList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderCard}>
              <div>
                <strong>شماره سفارش:</strong> {order.id}
              </div>
              <div>
                <strong>وضعیت:</strong>{" "}
                <span className={styles[`status-${order.status}`] || ""}>
                  {statusMap[order.status] || order.status}
                </span>
              </div>
              <div>
                <strong>آدرس:</strong>{" "}
                {order.shipping_address_detail
                  ? `${order.shipping_address_detail.state}، ${order.shipping_address_detail.city}، ${order.shipping_address_detail.address}`
                  : "—"}
              </div>
              <div>
                <strong>محصولات:</strong>
                <ul>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <li key={item.id}>
                        {item.product_variant?.product?.title || "محصول"}
                        {item.product_variant?.variant_display && (
                          <span> ({item.product_variant.variant_display})</span>
                        )}
                        {" - "}
                        تعداد: {item.quantity}
                        {" - "}
                        قیمت: {item.price?.toLocaleString()} تومان
                      </li>
                    ))
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
