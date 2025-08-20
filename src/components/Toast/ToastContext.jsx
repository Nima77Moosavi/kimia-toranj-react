import React, { createContext, useState, useContext, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={styles.container}>
        {toasts.map(({ id, message, type }) => (
          <div key={id} style={{ ...styles.toast, ...toastTypeStyles[type] }}>
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Inline styles for simplicity — move to CSS if preferred
const styles = {
  container: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    zIndex: 9999,
  },
  toast: {
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    minWidth: "200px",
  },
};

const toastTypeStyles = {
  success: { backgroundColor: "#4CAF50" },
  error: { backgroundColor: "#F44336" },
  warning: { backgroundColor: "#FF9800" },
  info: { backgroundColor: "#2196F3" },
};
