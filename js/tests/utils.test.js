import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  escapeHTML,
  sanitizeHTML,
  formatClassTime,
  formatCampusEventDate,
  getDateKey
} from "../js/utils.js";

describe("Utils Module Tests", () => {
  test("escapeHTML correctly escapes special HTML characters", () => {
    const raw = '<script>alert("XSS & test")</script>';
    const escaped = escapeHTML(raw);
    assert.equal(escaped, '&lt;script&gt;alert(&quot;XSS &amp; test&quot;)&lt;/script&gt;');
  });

  test("sanitizeHTML strips script tags and event attributes", () => {
    const malicious = '<div onclick="alert(1)">Hello <script>alert(2)</script></div>';
    const clean = sanitizeHTML(malicious);
    assert.equal(clean.includes("<script>"), false);
    assert.equal(clean.includes("onclick="), false);
    assert.equal(clean.includes("Hello"), true);
  });

  test("formatClassTime converts 24h string to 12h formatted time", () => {
    assert.equal(formatClassTime("09:00").toLocaleLowerCase().includes("9:00"), true);
    assert.equal(formatClassTime("14:15").toLocaleLowerCase().includes("2:15"), true);
    assert.equal(formatClassTime("invalid"), "invalid");
  });

  test("formatCampusEventDate formats ISO date key into readable string", () => {
    assert.equal(formatCampusEventDate("2026-10-09"), "9 Oct 2026");
    assert.equal(formatCampusEventDate(null), "Date to be announced");
    assert.equal(formatCampusEventDate("invalid"), "Date to be announced");
  });

  test("getDateKey produces YYYY-MM-DD formatted date key", () => {
    const date = new Date(2026, 9, 9); // Oct 9 2026
    assert.equal(getDateKey(date), "2026-10-09");
  });
});
