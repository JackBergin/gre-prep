import { ScoreResult } from "@/lib/types";
import {
  sampleMultiSelectQuestion,
  samplePassageQuestion,
  sampleVerbalQuestion,
} from "./questions";

export const verbalScoreResult: ScoreResult = {
  section: "verbal",
  totalQuestions: 3,
  correctCount: 2,
  incorrectCount: 1,
  skippedCount: 0,
  scaledScore: 157,
  results: [
    {
      question: sampleVerbalQuestion,
      selectedAnswer: "novel",
      isCorrect: true,
    },
    {
      question: samplePassageQuestion,
      selectedAnswer: "Populations are static",
      isCorrect: false,
    },
    {
      question: sampleMultiSelectQuestion,
      selectedAnswer: ["laudatory", "panegyric"],
      isCorrect: true,
    },
  ],
};

export const writingScoreResult: ScoreResult = {
  section: "writing",
  totalQuestions: 1,
  correctCount: 0,
  incorrectCount: 0,
  skippedCount: 0,
  scaledScore: 0,
  results: [
    {
      question: {
        id: "fixture-w1",
        section: "writing",
        type: "issue-task",
        prompt: "Write about technology.",
        explanation: "Use concrete examples.",
      },
      selectedAnswer: "Technology shapes society in many ways.",
      isCorrect: false,
    },
  ],
};
