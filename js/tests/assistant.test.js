import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getAssistantAnswer } from "../js/assistant.js";

describe("Assistant Module Tests", () => {
  test("getAssistantAnswer matches address keyword", () => {
    const res = getAssistantAnswer("Where is the campus location?");
    assert.equal(res.isMatched, true);
    assert.equal(res.answer.includes("Hesaraghatta Main Road"), true);
  });

  test("getAssistantAnswer matches facilities keyword", () => {
    const res = getAssistantAnswer("What facilities are available?");
    assert.equal(res.isMatched, true);
    assert.equal(res.answer.includes("classrooms"), true);
  });

  test("getAssistantAnswer returns fallback answer for unknown query", () => {
    const res = getAssistantAnswer("What is quantum entanglement?");
    assert.equal(res.isMatched, false);
    assert.equal(res.answer.includes("still learning"), true);
  });
});
