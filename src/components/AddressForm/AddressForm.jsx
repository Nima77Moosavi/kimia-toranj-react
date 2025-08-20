import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./AddressForm.module.css";
import { useToast } from "../Toast/ToastContext"; // ✅ import toast hook

const IRAN_API_BASE = "https://iran-locations-api.vercel.app/api/v1/fa";

const AddressForm = ({ onAddressAdded }) => {
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [postalCodeInput, setPostalCodeInput] = useState("");

  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [showStateList, setShowStateList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  const [loading, setLoading] = useState(false);

  const stateRef = useRef();
  const cityRef = useRef();

  const { addToast } = useToast(); // ✅ initialize toast

  // Load provinces
  useEffect(() => {
    axios
      .get(`${IRAN_API_BASE}/states`)
      .then(({ data }) => setStateOptions(data.map((st) => st.name)))
      .catch(() => addToast("خطا در دریافت لیست استان‌ها", "error"));
  }, [addToast]);

  // Load cities when state is valid
  useEffect(() => {
    if (!stateOptions.includes(stateInput)) {
      setCityOptions([]);
      setCityInput("");
      return;
    }
    axios
      .get(`${IRAN_API_BASE}/cities`, { params: { state: stateInput } })
      .then(({ data }) =>
        setCityOptions(
          Array.isArray(data[0]?.cities)
            ? data[0].cities.map((ct) => ct.name)
            : []
        )
      )
      .catch(() => {
        setCityOptions([]);
        addToast("خطا در دریافت لیست شهرها", "error");
      });
  }, [stateInput, stateOptions, addToast]);

  // Filter states
  useEffect(() => {
    setFilteredStates(
      stateOptions.filter((st) =>
        st.toLowerCase().includes(stateInput.toLowerCase())
      )
    );
  }, [stateInput, stateOptions]);

  // Filter cities
  useEffect(() => {
    setFilteredCities(
      cityOptions.filter((ct) =>
        ct.toLowerCase().includes(cityInput.toLowerCase())
      )
    );
  }, [cityInput, cityOptions]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!stateRef.current.contains(e.target)) {
        setShowStateList(false);
      }
      if (!cityRef.current.contains(e.target)) {
        setShowCityList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Convert Persian/Arabic numbers to English
  const convertToEnglishDigits = (str) => {
    return str
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(postalCodeInput)) {
      addToast("کد پستی باید دقیقاً ۱۰ رقم باشد", "error");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        state: stateInput,
        city: cityInput,
        address: addressInput,
        postal_code: postalCodeInput,
      };
      const { data } = await axiosInstance.post(
        "/api/store/shipping-addresses/",
        payload
      );
      onAddressAdded?.(data);

      setStateInput("");
      setCityInput("");
      setAddressInput("");
      setPostalCodeInput("");

      addToast("آدرس با موفقیت افزوده شد", "success"); // ✅ success toast
    } catch (err) {
      addToast("خطا در افزودن آدرس", "error"); // ✅ error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.addressForm} onSubmit={handleSubmit}>
      <h3>افزودن آدرس جدید</h3>

      {/* Province */}
      <div className={styles.formGroup} ref={stateRef}>
        <label htmlFor="state">استان:</label>
        <input
          id="state"
          type="text"
          value={stateInput}
          onChange={(e) => {
            setStateInput(e.target.value);
            setShowStateList(true);
          }}
          onFocus={() => setShowStateList(true)}
          placeholder="انتخاب استان"
          autoComplete="off"
          required
        />
        {showStateList && filteredStates.length > 0 && (
          <ul className={styles.suggestions}>
            {filteredStates.map((st) => (
              <li
                key={st}
                onClick={() => {
                  setStateInput(st);
                  setShowStateList(false);
                }}
              >
                {st}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* City */}
      <div className={styles.formGroup} ref={cityRef}>
        <label htmlFor="city">شهر:</label>
        <input
          id="city"
          type="text"
          value={cityInput}
          onChange={(e) => {
            setCityInput(e.target.value);
            setShowCityList(true);
          }}
          onFocus={() =>
            stateOptions.includes(stateInput) && setShowCityList(true)
          }
          placeholder={
            !stateOptions.includes(stateInput)
              ? "ابتدا استان را انتخاب کنید"
              : "انتخاب شهر"
          }
          disabled={!stateOptions.includes(stateInput)}
          autoComplete="off"
          required
        />
        {showCityList && filteredCities.length > 0 && (
          <ul className={styles.suggestions}>
            {filteredCities.map((ct) => (
              <li
                key={ct}
                onClick={() => {
                  setCityInput(ct);
                  setShowCityList(false);
                }}
              >
                {ct}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Street */}
      <div className={styles.formGroup}>
        <label htmlFor="address">آدرس:</label>
        <textarea
          id="address"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          required
        />
      </div>

      {/* Postal Code */}
      <div className={styles.formGroup}>
        <label htmlFor="postal-code">کد پستی:</label>
        <input
          id="postal-code"
          type="text"
          pattern="\d{10}"
          title="کد پستی باید دقیقاً ۱۰ رقم باشد"
          value={postalCodeInput}
          onChange={(e) => {
            const normalized = convertToEnglishDigits(e.target.value);
            setPostalCodeInput(normalized);
          }}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "در حال افزودن..." : "افزودن آدرس"}
      </button>
    </form>
  );
};

export default AddressForm;
