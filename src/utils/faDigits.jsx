// utils/faDigits.js
export function toPersianDigits(input) {
  return input.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

