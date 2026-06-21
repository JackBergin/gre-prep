import { Question } from "@/lib/types";

export const sampleVerbalQuestion: Question = {
  id: "fixture-v1",
  section: "verbal",
  type: "text-completion",
  prompt: "The scientist's findings were __________.",
  options: ["novel", "derivative", "opaque", "trivial", "redundant"],
  correctAnswer: "novel",
  explanation: "Novel fits the context of groundbreaking findings.",
};

export const samplePassageQuestion: Question = {
  id: "fixture-v2",
  section: "verbal",
  type: "reading-comprehension",
  prompt: "What is the main idea?",
  passage: "Researchers studied migration patterns over decades.",
  options: ["Climate drives change", "Populations are static", "Data is unreliable", "Theory is obsolete"],
  correctAnswer: "Climate drives change",
  explanation: "The passage emphasizes climate as the primary driver.",
};

export const sampleMultiSelectQuestion: Question = {
  id: "fixture-v3",
  section: "verbal",
  type: "sentence-equivalence",
  prompt: "The critic's review was surprisingly __________.",
  options: ["laudatory", "panegyric", "scathing", "terse", "ambiguous"],
  correctAnswer: ["laudatory", "panegyric"],
  explanation: "Laudatory and panegyric are synonymous praise.",
};

export const sampleQuantQuestion: Question = {
  id: "fixture-q1",
  section: "quantitative",
  type: "arithmetic",
  prompt: "What is 15% of 200?",
  options: ["20", "25", "30", "35", "40"],
  correctAnswer: "30",
  explanation: "15% of 200 equals 30.",
};

export const sampleWritingQuestion: Question = {
  id: "fixture-w1",
  section: "writing",
  type: "issue-task",
  prompt: "Governments should prioritize funding for the arts.",
  explanation: "Develop a clear thesis with supporting examples.",
};
