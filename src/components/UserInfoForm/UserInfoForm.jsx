import React, { useState } from "react";
import styles from "./UserInfoForm.module.css";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";

const UserInfoForm = () => {
  // آرایه‌های مورد نیاز برای تاریخ تولد (تقویم شمسی)
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
  // فرض کنید سال جاری ۱۴۰۲ و محدوده سال‌ها از ۱۳۰۰ تا ۱۴۰۲
  const currentYear = 1402;
  const startYear = 1300;
  const yearsArray = [];
  for (let y = currentYear; y >= startYear; y--) {
    yearsArray.push(y);
  }

  // آرایه نمونه برای استان‌ها و شهرهای ایران
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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    phoneNumber: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("اطلاعات ثبت شد:", formData);
    alert("اطلاعات شما با موفقیت ثبت شد!");
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.title}>ویرایش اطلاعات</h2>

      {/* نام؛ اینفیلد نام در حالت پیش‌فرض 70٪ باقی می‌ماند */}
      <div className={styles.inputGroup}>
        <label>نام:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="نام"
        />
      </div>

      {/* نام خانوادگی: تمام عرض فرم */}
      <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
        <label>نام خانوادگی:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="نام خانوادگی"
        />
      </div>

      {/* کد ملی: تمام عرض */}
      <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
        <label>کد ملی:</label>
        <input
          type="text"
          name="nationalCode"
          value={formData.nationalCode}
          onChange={handleChange}
          placeholder="کد ملی"
        />
      </div>

      {/* شماره تماس: تمام عرض */}
      <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
        <label>شماره تماس:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="شماره تماس"
        />
      </div>

      {/* تاریخ تولد به صورت کشویی */}
      <div className={styles.inputGroup}>
        <label>تاریخ تولد:</label>
        <div className={styles.dateFields}>
          <select
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
          >
            <option value="">روز</option>
            {daysArray.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            name="birthMonth"
            value={formData.birthMonth}
            onChange={handleChange}
          >
            <option value="">ماه</option>
            {persianMonths.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select
            name="birthYear"
            value={formData.birthYear}
            onChange={handleChange}
          >
            <option value="">سال</option>
            {yearsArray.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* جنسیت */}
      <div className={styles.inputGroup}>
        <label>جنسیت:</label>
        <div className={styles.genderFields}>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              onChange={handleChange}
              checked={formData.gender === "male"}
            />
            <FaMale color="#023047" size="50px" />{" "}
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={handleChange}
              checked={formData.gender === "female"}
            />
            <FaFemale color="#023047" size="50px" />{" "}
          </label>
        </div>
      </div>

      {/* استان: حالت کشویی (اگر نیاز به تغییر به تمام عرض دارید می‌توانید هم همینجا تغییر دهید) */}
      <div className={styles.inputGroup}>
        <label>استان:</label>
        <select
          name="province"
          value={formData.province}
          onChange={handleChange}
        >
          <option value="">انتخاب استان</option>
          {provinces.map((prov, index) => (
            <option key={index} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* شهر: حالت کشویی */}
      <div className={styles.inputGroup}>
        <label>شهر:</label>
        <select name="city" value={formData.city} onChange={handleChange}>
          <option value="">انتخاب شهر</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* کد پستی: تمام عرض */}
      <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
        <label>کد پستی:</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="کد پستی"
        />
      </div>

      {/* آدرس کامل: تمام عرض */}
      <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
        <label>آدرس کامل:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="آدرس کامل"
        ></textarea>
      </div>

      {/* دکمه ثبت */}
      <button type="submit" className={styles.submitButton}>
        ثبت اطلاعات
      </button>
    </form>
  );
};

export default UserInfoForm;
