/**
 * Assistant module for Sapthagiri NPS University Campus Companion
 */
import { campusAnswers } from "./data.js";
import { sanitizeHTML } from "./utils.js";

/**
 * Matches a user question against campus answers database.
 * @param {string} question - User question string
 * @returns {{ answer: string, isMatched: boolean }} Safe HTML answer object
 */
export function getAssistantAnswer(question) {
  if (!question || typeof question !== "string") {
    return {
      answer: "<strong>Please enter a question.</strong> Ask about facilities, programs, directions, admissions or the official website.",
      isMatched: false
    };
  }

  const normalized = question.trim().toLocaleLowerCase();
  if (!normalized) {
    return {
      answer: "<strong>Please enter a question.</strong> Ask about facilities, programs, directions, admissions or the official website.",
      isMatched: false
    };
  }

  const match = campusAnswers.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (match) {
    return {
      answer: sanitizeHTML(match.answer),
      isMatched: true
    };
  }

  return {
    answer: "<strong>I'm still learning about this campus.</strong> Ask about facilities, programs, directions, admissions or the official website.",
    isMatched: false
  };
}
