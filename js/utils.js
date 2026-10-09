/**
 * Utility functions for Sapthagiri NPS University Campus Companion
 * Provides safe HTML sanitization, string escaping, formatting, and performance utilities.
 */

/**
 * Escapes special HTML characters to prevent XSS.
 * @param {string} str - Raw input string
 * @returns {string} Escaped HTML string
 */
export function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitizes HTML strings allowing only safe formatting and link tags with safe attributes.
 * @param {string} html - HTML string to sanitize
 * @returns {string} Clean, safe HTML string
 */
export function sanitizeHTML(html) {
  if (typeof html !== "string") return "";
  
  // Replace potentially dangerous tags and protocols
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "about:blank");

  return cleaned;
}

/**
 * Creates a debounced version of a function to limit its execution rate.
 * @param {Function} func - Function to debounce
 * @param {number} waitMs - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, waitMs = 150) {
  let timeoutId = null;
  return function (...args) {
    const context = this;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(context, args);
      timeoutId = null;
    }, waitMs);
  };
}

/**
 * Formats a 24h time string ("HH:MM") into localized 12h time string ("H:MM am/pm").
 * @param {string} timeStr - Time string in "HH:MM" format
 * @returns {string} Localized time string
 */
export function formatClassTime(timeStr) {
  if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) {
    return timeStr || "";
  }
  const [hour, minute] = timeStr.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return timeStr;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(date);
}

/**
 * Formats an ISO date string ("YYYY-MM-DD") into a localized Indian date ("D MMM YYYY").
 * @param {string|null} dateKey - ISO date string or null
 * @returns {string} Formatted date string
 */
export function formatCampusEventDate(dateKey) {
  if (!dateKey || typeof dateKey !== "string") return "Date to be announced";
  const parts = dateKey.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return "Date to be announced";
  const [year, month, day] = parts;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(year, month - 1, day));
}

/**
 * Gets ISO date key ("YYYY-MM-DD") for current date.
 * @param {Date} [dateObj] - Optional Date object
 * @returns {string} ISO date key
 */
export function getDateKey(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Helper to safely query an element without crashing.
 * @template {Element} T
 * @param {string} selector - CSS selector
 * @param {ParentNode} [parent=document] - Parent container
 * @returns {T|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Helper to safely query all elements as an array.
 * @template {Element} T
 * @param {string} selector - CSS selector
 * @param {ParentNode} [parent=document] - Parent container
 * @returns {T[]}
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}
