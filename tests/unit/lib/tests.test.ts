import { describe, expect, it } from "vitest";
import {
  formatTime,
  getQuestionsForTest,
  getTestById,
  getTestsBySection,
  getTotalQuestionCount,
  sectionMeta,
  tests,
} from "@/lib/tests";

describe("tests lib", () => {
  it("filters curated tests by section", () => {
    const verbalTests = getTestsBySection("verbal");

    expect(verbalTests.length).toBeGreaterThan(0);
    expect(verbalTests.every((test) => test.section === "verbal")).toBe(true);
    expect(getTestById("verbal-practice-1")?.title).toBe("Practice Test 1");
  });

  it("formats time limits for gallery display", () => {
    expect(formatTime(30 * 60)).toBe("30 min");
    expect(formatTime(60 * 60)).toBe("1 hr");
    expect(formatTime(90 * 60)).toBe("90 min");
  });

  it("returns undefined for unknown test ids", () => {
    expect(getTestById("missing-test")).toBeUndefined();
    expect(getQuestionsForTest("missing-test")).toEqual([]);
  });

  it("resolves questions for a curated test", () => {
    const test = getTestById("verbal-quick-drill");
    const questions = getQuestionsForTest("verbal-quick-drill");

    expect(test?.questionCount).toBe(10);
    expect(questions).toHaveLength(10);
    expect(questions.every((q) => q.section === "verbal")).toBe(true);
  });

  it("exposes section metadata and total bank size", () => {
    expect(sectionMeta.verbal.title).toBe("Verbal Reasoning");
    expect(sectionMeta.quantitative.icon).toBe("∑");
    expect(getTotalQuestionCount()).toBeGreaterThan(0);
    expect(tests.length).toBeGreaterThan(10);
  });
});
