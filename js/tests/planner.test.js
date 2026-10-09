import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getClassLocation,
  calculateAttendanceStats,
  getTimetableDate
} from "../js/planner.js";

describe("Planner Module Tests", () => {
  test("getClassLocation resolves course code to room/location", () => {
    assert.equal(getClassLocation({ code: "LIB" }), "University library");
    assert.equal(getClassLocation({ code: "SPORTS" }), "Physical education");
    assert.equal(getClassLocation({ code: "OOP" }), "Room B207");
  });

  test("calculateAttendanceStats accurately computes stats and percentages", () => {
    const classes = [
      { code: "OOP", start: "09:00" },
      { code: "CN", start: "11:15" },
      { code: "DBMS", start: "12:15" }
    ];
    const dateKey = "2026-10-09";
    const records = {
      "2026-10-09:OOP:09:00": true,
      "2026-10-09:CN:11:15": true
    };

    const stats = calculateAttendanceStats(classes, dateKey, records);
    assert.equal(stats.attendedCount, 2);
    assert.equal(stats.totalCount, 3);
    assert.equal(stats.percentage, 67);
  });

  test("getTimetableDate calculates correct day offset", () => {
    const refDate = new Date(2026, 9, 9); // Friday, Oct 9 2026
    const monday = getTimetableDate(0, refDate);
    assert.equal(monday.getDate(), 5); // Monday Oct 5
    const friday = getTimetableDate(4, refDate);
    assert.equal(friday.getDate(), 9); // Friday Oct 9
  });
});
