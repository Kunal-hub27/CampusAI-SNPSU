import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getCampusEventStatus,
  filterAndSortCampusEvents
} from "../js/events.js";
import { campusEvents } from "../js/data.js";

describe("Events Module Tests", () => {
  const todayKey = "2026-10-09";

  test("getCampusEventStatus classifies date relative to today", () => {
    assert.equal(getCampusEventStatus({ date: "2026-09-30" }, todayKey), "past");
    assert.equal(getCampusEventStatus({ date: "2026-10-09" }, todayKey), "today");
    assert.equal(getCampusEventStatus({ date: "2026-10-15" }, todayKey), "upcoming");
    assert.equal(getCampusEventStatus({ date: null }, todayKey), "tba");
  });

  test("filterAndSortCampusEvents filters by technical category", () => {
    const techEvents = filterAndSortCampusEvents(campusEvents, "all", "technical", "", todayKey);
    assert.equal(techEvents.length, 4);
    assert.equal(techEvents.every((evt) => evt.category === "technical"), true);
  });

  test("filterAndSortCampusEvents filters by search query", () => {
    const results = filterAndSortCampusEvents(campusEvents, "all", "all", "promptwars", todayKey);
    assert.equal(results.length, 1);
    assert.equal(results[0].title, "PromptWars");
  });
});
