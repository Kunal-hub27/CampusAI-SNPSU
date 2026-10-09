/**
 * Weather module for Sapthagiri NPS University Campus Companion
 */
import { weatherDescriptions } from "./data.js";

/**
 * Returns weather recommendation string based on temperature in Celsius.
 * @param {number} temperature - Temperature in degrees C
 * @returns {string} Recommendation string
 */
export function getWeatherRecommendation(temperature) {
  if (temperature >= 30) {
    return "Take it easy in the midday sun.";
  }
  if (temperature <= 15) {
    return "A light layer might be a good call.";
  }
  return "A lovely day to take the long way.";
}

/**
 * Maps WMO weather code to description string.
 * @param {number} code - Weather code
 * @returns {string} Description
 */
export function getWeatherDescription(code) {
  return weatherDescriptions[code] || "Current conditions";
}

/**
 * Fetches live weather data from Open-Meteo API.
 * @param {typeof fetch} [fetchImpl=globalThis.fetch] - Fetch function implementation
 * @returns {Promise<{ temperature: number, description: string, recommendation: string }>}
 */
export async function fetchCampusWeather(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== "function") {
    throw new Error("Fetch implementation unavailable");
  }
  const response = await fetchImpl(
    "https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,weather_code&timezone=auto"
  );
  if (!response.ok) {
    throw new Error(`Weather request failed (${response.status})`);
  }
  const data = await response.json();
  if (!Number.isFinite(data.current?.temperature_2m) || !Number.isFinite(data.current?.weather_code)) {
    throw new Error("Weather response did not include current conditions");
  }

  const temperature = Math.round(data.current.temperature_2m);
  const description = getWeatherDescription(data.current.weather_code);
  const recommendation = getWeatherRecommendation(temperature);

  return { temperature, description, recommendation };
}
