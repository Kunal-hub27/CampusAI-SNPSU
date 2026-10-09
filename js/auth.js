/**
 * Authentication module for Sapthagiri NPS University Campus Companion
 */

export const AUTH_KEY = "sapthagiri-campus-prototype-session";

/**
 * Formats a student's email prefix into a presentable title-case name.
 * @param {string} email - Email address
 * @returns {string} Formatted display name
 */
export function formatStudentName(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "Student";
  }
  const prefix = email.split("@")[0].trim();
  if (!prefix) return "Student";
  return prefix
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}

/**
 * Validates whether an email string meets basic email format constraints.
 * @param {string} email - Email string
 * @returns {boolean} True if email is valid
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed);
}

/**
 * Validates prototype password length.
 * @param {string} password - Password string
 * @returns {boolean} True if password has at least 6 characters
 */
export function validatePassword(password) {
  return typeof password === "string" && password.trim().length >= 6;
}

/**
 * Reads stored user session from browser storage.
 * @param {Storage} [storage=sessionStorage]
 * @returns {string|null} Stored display name or null
 */
export function getStoredSession(storage = globalThis.sessionStorage) {
  try {
    return storage ? storage.getItem(AUTH_KEY) : null;
  } catch {
    return null;
  }
}

/**
 * Saves user session to browser storage.
 * @param {string} displayName - Student display name
 * @param {Storage} [storage=sessionStorage]
 */
export function setStoredSession(displayName, storage = globalThis.sessionStorage) {
  try {
    if (storage) storage.setItem(AUTH_KEY, displayName);
  } catch (err) {
    console.warn("Could not save session storage:", err);
  }
}

/**
 * Clears stored session.
 * @param {Storage} [storage=sessionStorage]
 */
export function clearStoredSession(storage = globalThis.sessionStorage) {
  try {
    if (storage) storage.removeItem(AUTH_KEY);
  } catch (err) {
    console.warn("Could not clear session storage:", err);
  }
}
