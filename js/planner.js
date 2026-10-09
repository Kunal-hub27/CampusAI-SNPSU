/**
 * Planner and Timetable module for Sapthagiri NPS University Campus Companion
 */
import { weeklyClasses } from "./data.js";
import { formatClassTime, getDateKey } from "./utils.js";

export const ATTENDANCE_STORAGE_KEY = "sapthagiri-sem3-attendance";

/**
 * Gets location name for a course.
 * @param {object} course
 * @returns {string} Location
 */
export function getClassLocation(course) {
  if (course.code === "LIB") return "University library";
  if (course.code === "SPORTS") return "Physical education";
  return "Room B207";
}

/**
 * Calculates date for a specific timetable day index (0=Mon .. 6=Sun) within the current week.
 * @param {number} dayIndex
 * @param {Date} [refDate=new Date()]
 * @returns {Date} Date object for target weekday
 */
export function getTimetableDate(dayIndex, refDate = new Date()) {
  const date = new Date(refDate);
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset + dayIndex);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Calculates attendance count and percentage.
 * @param {object[]} classes - Class items array for the day
 * @param {string} dateKey - ISO date key ("YYYY-MM-DD")
 * @param {Record<string, boolean>} records - Attendance records object
 * @returns {{ attendedCount: number, totalCount: number, percentage: number }}
 */
export function calculateAttendanceStats(classes, dateKey, records) {
  if (!Array.isArray(classes) || classes.length === 0) {
    return { attendedCount: 0, totalCount: 0, percentage: 0 };
  }
  const attendedCount = classes.filter((course) =>
    records[`${dateKey}:${course.code}:${course.start}`] === true
  ).length;
  const totalCount = classes.length;
  const percentage = Math.round((attendedCount / totalCount) * 100);
  return { attendedCount, totalCount, percentage };
}

/**
 * Reads attendance records safely from storage.
 * @param {Storage} [storage=localStorage]
 * @returns {Record<string, boolean>}
 */
export function loadAttendanceRecords(storage = globalThis.localStorage) {
  try {
    const raw = storage ? storage.getItem(ATTENDANCE_STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves attendance records safely to storage.
 * @param {Record<string, boolean>} records
 * @param {Storage} [storage=localStorage]
 * @returns {boolean} True if successful
 */
export function saveAttendanceRecords(records, storage = globalThis.localStorage) {
  try {
    if (storage) {
      storage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
      return true;
    }
  } catch (err) {
    console.warn("Could not save attendance to localStorage:", err);
  }
  return false;
}
