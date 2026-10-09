/**
 * Events module for Sapthagiri NPS University Campus Companion
 */
import { campusEvents } from "./data.js";
import { formatCampusEventDate, getDateKey } from "./utils.js";

/**
 * Calculates event status based on event date and today's ISO key.
 * @param {object} event - Event object
 * @param {string} todayKey - Today ISO date string ("YYYY-MM-DD")
 * @returns {"tba"|"past"|"today"|"upcoming"} Status string
 */
export function getCampusEventStatus(event, todayKey) {
  if (!event || !event.date) return "tba";
  if (event.date < todayKey) return "past";
  if (event.date === todayKey) return "today";
  return "upcoming";
}

/**
 * Filters and sorts events according to status, category, and search query.
 * @param {object[]} events - Array of events
 * @param {string} selectedStatus - Filter status ('all', 'past', 'today', 'upcoming')
 * @param {string} selectedCategory - Filter category ('all', 'technical', 'cultural')
 * @param {string} searchQuery - Text query string
 * @param {string} [todayKey] - Today's date key
 * @returns {object[]} Filtered and sorted events
 */
export function filterAndSortCampusEvents(events, selectedStatus, selectedCategory, searchQuery, todayKey = getDateKey()) {
  const normalizedQuery = (searchQuery || "").trim().toLocaleLowerCase();

  return events
    .map((event) => ({ ...event, status: getCampusEventStatus(event, todayKey) }))
    .filter((event) => {
      const statusMatches =
        selectedStatus === "all" ||
        (selectedStatus === "upcoming"
          ? ["upcoming", "tba"].includes(event.status)
          : event.status === selectedStatus);

      const categoryMatches = selectedCategory === "all" || event.category === selectedCategory;

      const queryMatches =
        !normalizedQuery ||
        `${event.title} ${event.category} ${event.location} ${event.details}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);

      return statusMatches && categoryMatches && queryMatches;
    })
    .sort((first, second) => {
      const rank = { past: 0, today: 1, upcoming: 2, tba: 3 };
      if (rank[first.status] !== rank[second.status]) return rank[first.status] - rank[second.status];
      if (!first.date || !second.date) return 0;
      return first.status === "past"
        ? second.date.localeCompare(first.date)
        : first.date.localeCompare(second.date);
    });
}
