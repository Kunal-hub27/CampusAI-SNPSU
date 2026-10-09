import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getWeatherRecommendation,
  getWeatherDescription,
  fetchCampusWeather
} from "../js/weather.js";

describe("Weather Module Tests", () => {
  test("getWeatherRecommendation returns appropriate advice per temp", () => {
    assert.equal(getWeatherRecommendation(32), "Take it easy in the midday sun.");
    assert.equal(getWeatherRecommendation(12), "A light layer might be a good call.");
    assert.equal(getWeatherRecommendation(24), "A lovely day to take the long way.");
  });

  test("getWeatherDescription maps WMO codes to strings", () => {
    assert.equal(getWeatherDescription(0), "Clear skies");
    assert.equal(getWeatherDescription(95), "Thunderstorms");
    assert.equal(getWeatherDescription(999), "Current conditions");
  });

  test("fetchCampusWeather successfully parses weather data with mock fetch", async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 26.4,
          weather_code: 1
        }
      })
    });

    const res = await fetchCampusWeather(mockFetch);
    assert.equal(res.temperature, 26);
    assert.equal(res.description, "Mostly clear");
    assert.equal(res.recommendation, "A lovely day to take the long way.");
  });
});
