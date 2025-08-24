// src/store/cartStore.js
import { create } from "zustand";
import axiosInstanceNoRedirect from "./utils/axiosInstanceNoRedirect";
import { API_URL } from "./config";

export const useCartStore = create((set, get) => ({
  cartItems: [],

  // --- Derived values ---
  cartCount: () =>
    get().cartItems.reduce((sum, item) => sum + item.quantity, 0),

  cartTotal: () =>
    get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),

  // --- Internal helper to update state + persist ---
  persist: (items) => {
    set({ cartItems: items });
    localStorage.setItem("cart", JSON.stringify(items));
  },

  // --- Load from localStorage ---
  loadCart: () => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    set({ cartItems: stored });
  },

  // --- Fetch from backend ---
  fetchCartFromBackend: async () => {
    try {
      const res = await axiosInstanceNoRedirect.get("api/store/cart/");
      const items = (res.data.items || []).map((it) => ({
        id: it.product?.id ?? null,
        variantId: it.product_variant?.id ?? null,
        title: it.product?.title ?? "",
        price: it.product?.price ?? 0,
        quantity: it.quantity ?? 0,
      }));
      get().persist(items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  },

  // --- Add to cart with order_count step ---
  addToCart: async ({ product, variantId, price, orderCount = 1 }) => {
    try {
      // 1. Get current cart from backend
      const res = await axiosInstanceNoRedirect.get("api/store/cart/");
      let currentItems =
        res.data.items?.map((it) => ({
          product_variant_id: it.product_variant.id,
          quantity: it.quantity,
        })) || [];

      // 2. Merge or add new item
      const idx = currentItems.findIndex(
        (it) => it.product_variant_id === variantId
      );
      if (idx >= 0) {
        currentItems[idx].quantity += orderCount;
      } else {
        currentItems.push({
          product_variant_id: variantId,
          quantity: orderCount,
        });
      }

      // 3. Update backend
      await axiosInstanceNoRedirect.patch(`${API_URL}api/store/cart/`, {
        items: currentItems,
      });

      // 4. Refetch updated cart and update store
      await get().fetchCartFromBackend();
    } catch (err) {
      console.error("Error adding to cart:", err);
      throw err;
    }
  },

  // --- Update quantity directly ---
  updateQuantity: async (variantId, quantity) => {
    try {
      const res = await axiosInstanceNoRedirect.get("api/store/cart/");
      let currentItems =
        res.data.items?.map((it) => ({
          product_variant_id: it.product_variant.id,
          quantity: it.quantity,
        })) || [];

      const idx = currentItems.findIndex(
        (it) => it.product_variant_id === variantId
      );
      if (idx >= 0) {
        currentItems[idx].quantity = quantity;
      }

      await axiosInstanceNoRedirect.patch(`${API_URL}api/store/cart/`, {
        items: currentItems,
      });

      await get().fetchCartFromBackend();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  },

  // --- Remove from cart ---
  removeFromCart: async (variantId) => {
    try {
      const res = await axiosInstanceNoRedirect.get("api/store/cart/");
      let currentItems =
        res.data.items?.map((it) => ({
          product_variant_id: it.product_variant.id,
          quantity: it.quantity,
        })) || [];

      currentItems = currentItems.filter(
        (it) => it.product_variant_id !== variantId
      );

      await axiosInstanceNoRedirect.patch(`${API_URL}api/store/cart/`, {
        items: currentItems,
      });

      await get().fetchCartFromBackend();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  },

  // --- Clear cart ---
  clearCart: async () => {
    try {
      await axiosInstanceNoRedirect.patch(`${API_URL}api/store/cart/`, {
        items: [],
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
    get().persist([]);
  },
}));
