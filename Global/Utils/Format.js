/**
 * Shortens a string to a desired length and appends an optional ending string if the original string is longer.
 * @param {string} str - The input string.
 * @param {number} length - The desired length of the truncated string.
 * @param {string} end - The optional ending string to append.
 * @returns {string} The truncated string.
 */
function textTruncate(str = '', length = 100, end = '...') {
    return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
  }
  
  /**
   * An extension of the textTruncate function with a shorter name for convenience.
   * @param {string} str - The input string.
   * @param {number} length - The desired length of the truncated string.
   * @param {string} end - The optional ending string to append.
   * @returns {string} The truncated string.
   */
  function truncate(...options) {
    return textTruncate(...options);
  }
  
  /**
   * Adds ordinal suffixes (e.g., "st", "nd", "rd", "th") to input numbers.
   * @param {number} n - The input number.
   * @returns {string} The input number with ordinal suffix.
   */
  function ordinalize(n = 0) {
    return Number(n) + [, 'º', 'º', 'º'][n / 10 % 10 ^ 1 && n % 10] || Number(n) + 'º'; //return Number(n)+[,'st','nd','rd'][n/10%10^1&&n%10]||Number(n)+'th';
  }
  
  /**
   * Converts a number to a string and adds comma separators for improved readability.
   * @param {number} number - The input number.
   * @param {number} maximumFractionDigits - The maximum number of fraction digits.
   * @returns {string} The formatted number as a string.
   */
  function commatize(number, maximumFractionDigits = 2) {
    return Number(number || '').toLocaleString('en-US', { maximumFractionDigits });
  }
  
  /**
   * Converts a number to a stringified compact version using a specific notation.
   * @param {number} number - The input number.
   * @param {number} maximumFractionDigits - The maximum number of fraction digits.
   * @returns {string} The compact formatted number as a string.
   */
  function compactNum(number, maximumFractionDigits = 2) {
    return Number(number || '').toLocaleString('en-US', { notation: 'compact', maximumFractionDigits });
  }
  
  /**
   * Cleans text by replacing backticks and at symbols with their respective characters and a zero-width space character.
   * @param {string} text - The input text.
   * @returns {string} The cleaned text.
   */
  function clean(text) {
    return String(text).replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`)
  }
  
  /**
  * Converts a count into a string representation with custom digits.
  * @param {number} count - The numerical count to be converted.
  * @param {number} digits - The number of digits in the resulting string (optional).
  * @returns {Promise<string>} The string representation of the count.
  */
  function toSmallNum(count, digits) {
    let result = '';
    if (!digits) digits = count.toString().length;
    for (let i = 0; i < digits; i++) {
      let digit = count % 10;
      count = Math.trunc(count / 10);
      result = numbers[digit] + result;
    }
    return result;
  };
  
  /**
   * Formats a number with thousands separators.
   * @param {number} num - The number to be formatted.
   * @returns {string} The formatted number as a string.
   */
  function toFancyNum(num) {
    let parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  
  /**
   * Shortens a number using shorthand notation.
   * @param {number} num - The number to be shortened.
   * @returns {string|number} The shortened number as a string ('K', 'M') or the original number.
   */
  function toShortNum(num) {
    if (num >= 1000000) {
        return Math.trunc(num / 1000000) + 'M';
    } else if (num >= 1000) {
        return Math.trunc(num / 1000) + 'K';
    } else {
        return num;
    }
  }
  
  
  module.exports = {
    textTruncate,
    truncate,
    ordinalize,
    commatize,
    compactNum,
    clean,
    toSmallNum,
    toFancyNum,
    toShortNum
  };