import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  formatStudentName,
  validateEmail,
  validatePassword
} from "../js/auth.js";

describe("Auth Module Tests", () => {
  test("formatStudentName converts email to formatted student name", () => {
    assert.equal(formatStudentName("kunaal.singh@snpsu.edu.in"), "Kunaal Singh");
    assert.equal(formatStudentName("john_doe-123@example.com"), "John Doe 123");
    assert.equal(formatStudentName(""), "Student");
    assert.equal(formatStudentName(null), "Student");
  });

  test("validateEmail strictly validates email format", () => {
    assert.equal(validateEmail("user@example.com"), true);
    assert.equal(validateEmail("kunaal@snpsu.edu.in"), true);
    assert.equal(validateEmail("invalid-email"), false);
    assert.equal(validateEmail("user@"), false);
    assert.equal(validateEmail(""), false);
  });

  test("validatePassword enforces minimum length of 6 characters", () => {
    assert.equal(validatePassword("123456"), true);
    assert.equal(validatePassword("password123"), true);
    assert.equal(validatePassword("12345"), false);
    assert.equal(validatePassword(""), false);
  });
});
