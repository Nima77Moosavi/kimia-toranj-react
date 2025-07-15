// src/utils/formatPrice.js

// Map 0–9 → Persian digits
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

/**
 * formatPrice
 * - Inserts standard commas every three digits
 * - Swaps each Latin digit for its Persian counterpart
 *
 * @param {number|string} price
 * @returns {string}
 */
export function formatPrice(price) {
  // 1) ensure it’s a string, then add commas
  const withCommas = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "/");

  // 2) replace each digit with Persian digit
  return withCommas.replace(/\d/g, (digit) => persianDigits[digit]);
}
