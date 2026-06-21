import { describe, expect, it } from "vitest";
import { calculateScore } from "@/lib/scoring";
import { Answer, Question } from "@/lib/types";

const verbalQuestions: Question[] = [
  {
    id: "v1",
    section: "verbal",
    type: "text-completion",
    prompt: "Sample prompt",
    correctAnswer: "A",
    explanation: "Because A fits the blank.",
  },
  {
    id: "v2",
    section: "verbal",
    type: "sentence-equivalence",
    prompt: "Pick two",
    correctAnswer: ["B", "C"],
    explanation: "B and C are synonyms.",
  },
  {
    id: "v3",
    section: "verbal",
    type: "reading-comprehension",
    prompt: "Main idea?",
    correctAnswer: "D",
    explanation: "D summarizes the passage.",
  },
];

describe("calculateScore", () => {
  it("counts correct, incorrect, and skipped answers and maps to GRE scale", () => {
    const answers: Answer[] = [
      { questionId: "v1", selectedAnswer: "A" },
      { questionId: "v2", selectedAnswer: ["C", "B"] },
      { questionId: "v3", selectedAnswer: null },
    ];

    const result = calculateScore("verbal", verbalQuestions, answers);

    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(0);
    expect(result.skippedCount).toBe(1);
    expect(result.scaledScore).toBe(157);
    expect(result.results.find((r) => r.question.id === "v2")?.isCorrect).toBe(true);
    expect(result.results.find((r) => r.question.id === "v3")?.isCorrect).toBe(false);
  });

  it("marks wrong single-choice answers as incorrect", () => {
    const answers: Answer[] = [{ questionId: "v1", selectedAnswer: "B" }];

    const result = calculateScore("verbal", [verbalQuestions[0]], answers);

    expect(result.correctCount).toBe(0);
    expect(result.incorrectCount).toBe(1);
    expect(result.skippedCount).toBe(0);
    expect(result.scaledScore).toBe(130);
  });

  it("treats empty strings as skipped answers", () => {
    const answers: Answer[] = [{ questionId: "v1", selectedAnswer: "" }];

    const result = calculateScore("verbal", [verbalQuestions[0]], answers);

    expect(result.skippedCount).toBe(1);
    expect(result.incorrectCount).toBe(0);
  });

  it("normalizes multi-select order when grading", () => {
    const answers: Answer[] = [{ questionId: "v2", selectedAnswer: ["C", "B"] }];

    const result = calculateScore("verbal", [verbalQuestions[1]], answers);

    expect(result.correctCount).toBe(1);
    expect(result.results[0].isCorrect).toBe(true);
  });

  it("returns minimum scaled score when no questions are provided", () => {
    const result = calculateScore("verbal", [], []);

    expect(result.totalQuestions).toBe(0);
    expect(result.scaledScore).toBe(130);
  });

  it("returns zero scaled score for writing sections", () => {
    const writingQuestions: Question[] = [
      {
        id: "w1",
        section: "writing",
        type: "issue-task",
        prompt: "Write an essay",
        explanation: "Rubric guidance.",
      },
    ];
    const answers: Answer[] = [{ questionId: "w1", selectedAnswer: "draft text" }];

    const result = calculateScore("writing", writingQuestions, answers);

    expect(result.scaledScore).toBe(0);
    expect(result.results[0].isCorrect).toBe(false);
  });
});
