import { describe, expect, it } from "vitest";
import {
  getQuestionById,
  getQuestionCountBySection,
  getQuestionsByIds,
  getQuestionsBySection,
  questions,
} from "@/lib/questions";

describe("questions lib", () => {
  it("returns all questions in a section", () => {
    const verbal = getQuestionsBySection("verbal");

    expect(verbal.length).toBeGreaterThan(0);
    expect(verbal.every((q) => q.section === "verbal")).toBe(true);
  });

  it("looks up a question by id", () => {
    const question = getQuestionById("v1");

    expect(question).toBeDefined();
    expect(question?.section).toBe("verbal");
  });

  it("returns undefined for unknown ids", () => {
    expect(getQuestionById("does-not-exist")).toBeUndefined();
  });

  it("resolves questions by id list preserving order and skipping unknown ids", () => {
    const resolved = getQuestionsByIds(["v1", "missing", "v2"]);

    expect(resolved.map((q) => q.id)).toEqual(["v1", "v2"]);
  });

  it("returns section counts as a record or single section total", () => {
    const counts = getQuestionCountBySection();

    expect(counts).toMatchObject({
      verbal: expect.any(Number),
      quantitative: expect.any(Number),
      writing: expect.any(Number),
    });

    const verbalCount = getQuestionCountBySection("verbal");
    expect(verbalCount).toBe(getQuestionsBySection("verbal").length);
  });

  it("aggregates the full question bank", () => {
    const total =
      getQuestionCountBySection("verbal") +
      getQuestionCountBySection("quantitative") +
      getQuestionCountBySection("writing");

    expect(questions.length).toBe(total);
  });
});
