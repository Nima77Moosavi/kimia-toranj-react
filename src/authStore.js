// src/store/authStore.js
import { create } from "zustand";
import { jwtDecode } from "jwt-decode"; 

export const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: null,

  // Derived state
  isAuthenticated: () => !!get().accessToken,

  setTokens: (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    set({ accessToken: access, refreshToken: refresh });

    try {
      const decoded = jwtDecode(access);
      set({ user: decoded });
    } catch {
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
