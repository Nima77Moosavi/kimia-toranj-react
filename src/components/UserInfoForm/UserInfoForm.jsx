// src/components/UserInfoForm/UserInfoForm.jsx
import React, { useState, useEffect } from "react";
import styles from "./UserInfoForm.module.css";
import { FaMale, FaFemale } from "react-icons/fa";
import { API_URL } from "../../config";
import { toPersianDigits } from "../../utils/faDigits";
import axiosInstance from "../../utils/axiosInstance";

const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);
const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const currentYear = 1402;
const startYear = 1300;
const yearsArray = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => currentYear - i
);

const provinces = [
  "تهران",
  "اصفهان",
  "خراسان رضوی",
  "فارس",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "کرمان",
  "گلستان",
  "همدان",
  "مرکزی",
  "کردستان",
  "یزد",
  "سیستان و بلوچستان",
  "مازندران",
];

const cities = [
  "تهران",
  "اصفهان",
  "مشهد",
  "شیراز",
  "تبریز",
  "کرمانشاه",
  "رشت",
  "اهواز",
  "قزوین",
];

export default function UserInfoForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
    province: "",
    city: "",
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user info on mount
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        // axiosInstance already injects Authorization header
        const response = await axiosInstance.get("api/store/customer/me/");
        if (!isMounted) return;

        const data = response.data;

        // split birth_date into Persian parts if present
        let day = "",
          month = "",
          year = "";
        if (data.birth_date) {
          const [y, m, d] = data.birth_date.split("-");
          // adjust Gregorian→Persian if you need
          year = String(Number(y) - 621);
          month = String(Number(m));
          day = String(Number(d));
        }

        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          nationalCode: data.national_id || "",
          birthDay: day,
          birthMonth: month,
          birthYear: year,
          gender: data.gender || "",
          province: data.province || "",
          city: data.city || "",
        });
      } catch (err) {
        // read message from server or fallback
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.error ||
          err.message;
        if (isMounted) setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // simple required check
    if (!formData.firstName || !formData.lastName || !formData.nationalCode) {
      setError("لطفاً فیلدهای ستاره‌دار را پر کنید.");
      return;
    }

    // build ISO birth_date: assume Persian calendar → convert to Gregorian
    // For demo, we'll just concat in YYYY-MM-DD (you may need a proper converter)
    const isoBirth =
      formData.birthYear && formData.birthMonth && formData.birthDay
        ? `${Number(formData.birthYear) - 621}`.padStart(4, "0") +
          `-${String(formData.birthMonth).padStart(2, "0")}` +
          `-${String(formData.birthDay).padStart(2, "0")}`
        : null;

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      national_id: formData.nationalCode,
      birth_date: isoBirth,
      gender: formData.gender,
      province: formData.province,
      city: formData.city,
    };

    setSaving(true);
    try {
      await axiosInstance.patch("api/store/customer/me/", payload);

      setSuccess("اطلاعات با موفقیت بروزرسانی شد.");
    } catch (err) {
      // grab server‐sent error or fall back to JS Error message
      const serverMsg =
        err.response?.data?.error || err.response?.data?.detail || err.message;
      setError(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>در حال بارگذاری…</div>;
  return (
    <div className={styles.formContainer}>
      <form className={styles.formWrapper} onSubmit={handleSubmit}>
        <h2 className={styles.title}>ویرایش اطلاعات کاربر</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <div className={styles.formGrid}>
          {/* First Name */}
          <div className={styles.inputGroup}>
            <label>
              نام <span className={styles.required}>*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched.firstName && !formData.firstName ? styles.error : ""
              }
            />
            {touched.firstName && !formData.firstName && (
              <div className={styles.errorMessage}>این فیلد الزامی است</div>
            )}
          </div>

          {/* Last Name */}
          <div className={styles.inputGroup}>
            <label>
              نام خانوادگی <span className={styles.required}>*</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched.lastName && !formData.lastName ? styles.error : ""
              }
            />
            {touched.lastName && !formData.lastName && (
              <div className={styles.errorMessage}>این فیلد الزامی است</div>
            )}
          </div>

          {/* National Code */}
          <div className={styles.inputGroup}>
            <label>
              کد ملی <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="nationalCode"
              maxLength="10"
              value={formData.nationalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched.nationalCode && !formData.nationalCode
                  ? styles.error
                  : ""
              }
            />
            {touched.nationalCode && !formData.nationalCode && (
              <div className={styles.errorMessage}>این فیلد الزامی است</div>
            )}
          </div>

          {/* Birth Date */}
          <div className={styles.inputGroup}>
            <label>تاریخ تولد</label>
            <div className={styles.dateFields}>
              <select
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                className={styles.dateSelect}
              >
                <option value="">روز</option>
                {daysArray.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                className={styles.dateSelect}
              >
                <option value="">ماه</option>
                {persianMonths.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className={styles.dateSelect}
              >
                <option value="">سال</option>
                {yearsArray.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div className={`${styles.inputGroup} ${styles.genderGroup}`}>
            <label>جنسیت</label>
            <div className={styles.genderFields}>
              {["male", "female"].map((g) => (
                <label key={g} className={styles.genderLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className={styles.genderInput}
                  />
                  <div
                    className={`${styles.genderOption} ${
                      formData.gender === g ? styles.selected : ""
                    }`}
                  >
                    {g === "male" ? (
                      <FaMale className={styles.genderIcon} />
                    ) : (
                      <FaFemale className={styles.genderIcon} />
                    )}
                    <span>{g === "male" ? "مرد" : "زن"}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Province */}
          <div className={styles.inputGroup}>
            <label>استان</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={styles.selectField}
            >
              <option value="">انتخاب استان</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className={styles.inputGroup}>
            <label>شهر</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.selectField}
            >
              <option value="">انتخاب شهر</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            disabled={saving}
            className={styles.submitButton}
          >
            {saving ? "در حال ذخیره…" : "ثبت اطلاعات"}
          </button>
        </div>
      </form>
    </div>
  );
}
