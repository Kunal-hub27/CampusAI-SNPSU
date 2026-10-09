/**
 * Map and navigation utilities for Sapthagiri NPS University Campus Companion
 */
import { campusAddress } from "./data.js";

/**
 * Builds Google Maps search URL.
 * @param {string} query - Search query
 * @returns {string} Google Maps URL
 */
export function buildGoogleMapsSearchUrl(query) {
  const params = new URLSearchParams({ api: "1", query });
  return `https://www.google.com/maps/search/?${params}`;
}

/**
 * Builds Google Maps directions URL from origin to destination.
 * @param {string} destination - Destination place or address
 * @param {string} [travelMode="driving"] - Mode of travel ("driving"|"walking"|"bicycling"|"transit")
 * @param {string} [origin] - Optional custom origin (defaults to Sapthagiri NPS University address)
 * @returns {string} Directions URL
 */
export function buildGoogleMapsRouteUrl(destination, travelMode = "driving", origin = `Sapthagiri NPS University, ${campusAddress}`) {
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: travelMode
  });
  return `https://www.google.com/maps/dir/?${params}`;
}
