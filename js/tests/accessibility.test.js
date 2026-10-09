import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Accessibility & HTML Markup Audit Tests", () => {
  const indexPath = path.join(process.cwd(), "index.html");
  const htmlContent = fs.readFileSync(indexPath, "utf-8");

  test("index.html contains Skip Link for keyboard navigation", () => {
    assert.equal(htmlContent.includes('class="skip-link"'), true);
    assert.equal(htmlContent.includes('href="#home"'), true);
  });

  test("index.html contains valid viewport and lang declarations", () => {
    assert.equal(htmlContent.includes('<html lang="en">'), true);
    assert.equal(htmlContent.includes('name="viewport"'), true);
  });

  test("index.html contains main landmark elements", () => {
    assert.equal(htmlContent.includes('<main'), true);
    assert.equal(htmlContent.includes('<nav'), true);
    assert.equal(htmlContent.includes('<aside'), true);
    assert.equal(htmlContent.includes('<header'), true);
    assert.equal(htmlContent.includes('<footer'), true);
  });

  test("index.html contains Content Security Policy meta tag", () => {
    assert.equal(htmlContent.includes('http-equiv="Content-Security-Policy"'), true);
  });
});
