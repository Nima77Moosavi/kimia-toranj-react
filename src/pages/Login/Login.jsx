import React, { useState } from "react";
import styles from "./Login.module.css"; // Import the CSS module

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/send-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phone }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "خطا در ارسال کد");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/verify-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phone, code: otp }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "کد وارد شده صحیح نیست");

      // Save tokens and role
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("is_admin", data.is_admin); // Store admin status

      alert("ورود با موفقیت انجام شد");

      // Redirect based on role
      window.location.href = data.is_admin ? "/admin-dashboard" : "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>ورود / ثبت نام</h2>
        {error && <p className={styles.error}>{error}</p>}

        {step === 1 ? (
          <>
            <input
              type="tel"
              placeholder="شماره موبایل"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
            />
            <button
              onClick={sendOTP}
              disabled={loading}
              className={styles.button}
            >
              {loading ? "درحال ارسال..." : "ارسال کد"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="کد تایید"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.input}
            />
            <button
              onClick={verifyOTP}
              disabled={loading}
              className={styles.button}
            >
              {loading ? "درحال بررسی..." : "تایید کد"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
