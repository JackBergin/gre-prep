import { Section, TestDefinition } from "./types";
import { getQuestionsByIds, verbalQuestions, quantitativeQuestions, writingQuestions } from "./questions";

function ids(prefix: string, start: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}${start + i}`);
}

function everyNth<T>(items: T[], n: number, offset = 0): T[] {
  const out: T[] = [];
  for (let i = offset; i < items.length; i += n) {
    out.push(items[i]);
  }
  return out;
}

const quantAll = quantitativeQuestions.map((q) => q.id);

export const tests: TestDefinition[] = [
  // ── VERBAL ────────────────────────────────────────────────────────────────
  {
    id: "verbal-practice-1",
    title: "Practice Test 1",
    description: "Balanced mix of reading comprehension, text completion, and sentence equivalence.",
    section: "verbal",
    questionCount: 20,
    timeLimit: 30 * 60,
    questionIds: [...ids("v", 1, 14), ...ids("v", 41, 3), ...ids("v", 71, 3)],
  },
  {
    id: "verbal-practice-2",
    title: "Practice Test 2",
    description: "Second full-length verbal set drawing from across the question bank.",
    section: "verbal",
    questionCount: 20,
    timeLimit: 30 * 60,
    questionIds: [...ids("v", 15, 14), ...ids("v", 44, 3), ...ids("v", 74, 3)],
  },
  {
    id: "verbal-quick-drill",
    title: "Quick Drill",
    description: "Short 10-question warm-up covering all verbal question types.",
    section: "verbal",
    questionCount: 10,
    timeLimit: 12 * 60,
    questionIds: ["v1", "v5", "v41", "v45", "v71", "v75", "v20", "v50", "v80", "v90"],
  },
  {
    id: "verbal-vocab-focus",
    title: "Vocabulary Focus",
    description: "Text completion and sentence equivalence only—ideal for vocab review.",
    section: "verbal",
    questionCount: 15,
    timeLimit: 20 * 60,
    questionIds: [...ids("v", 41, 8), ...ids("v", 71, 7)],
  },
  {
    id: "verbal-reading-focus",
    title: "Reading Comprehension",
    description: "Passage-based questions only, mirroring the RC portion of the GRE.",
    section: "verbal",
    questionCount: 20,
    timeLimit: 35 * 60,
    questionIds: ids("v", 1, 20),
  },
  {
    id: "verbal-full-section",
    title: "Full Section",
    description: "Timed 40-question verbal section—closest to real GRE length.",
    section: "verbal",
    questionCount: 40,
    timeLimit: 41 * 60,
    questionIds: ids("v", 1, 40),
  },

  // ── QUANTITATIVE ──────────────────────────────────────────────────────────
  {
    id: "quant-practice-1",
    title: "Practice Test 1",
    description: "Mixed arithmetic, algebra, geometry, and data analysis problems.",
    section: "quantitative",
    questionCount: 20,
    timeLimit: 35 * 60,
    questionIds: everyNth(quantAll, 5, 0).slice(0, 20),
  },
  {
    id: "quant-practice-2",
    title: "Practice Test 2",
    description: "Second quant set with different problem types and difficulty spread.",
    section: "quantitative",
    questionCount: 20,
    timeLimit: 35 * 60,
    questionIds: everyNth(quantAll, 5, 2).slice(0, 20),
  },
  {
    id: "quant-quick-drill",
    title: "Quick Drill",
    description: "10 fast problems to sharpen mental math and pacing.",
    section: "quantitative",
    questionCount: 10,
    timeLimit: 15 * 60,
    questionIds: ["q1", "q26", "q51", "q76", "q10", "q35", "q60", "q85", "q15", "q50"],
  },
  {
    id: "quant-algebra-geometry",
    title: "Algebra & Geometry",
    description: "Focused practice on algebraic manipulation and geometric reasoning.",
    section: "quantitative",
    questionCount: 20,
    timeLimit: 35 * 60,
    questionIds: [...ids("q", 26, 10), ...ids("q", 51, 10)],
  },
  {
    id: "quant-data-arithmetic",
    title: "Data & Arithmetic",
    description: "Percentages, ratios, means, and data interpretation skills.",
    section: "quantitative",
    questionCount: 20,
    timeLimit: 30 * 60,
    questionIds: [...ids("q", 1, 10), ...ids("q", 76, 10)],
  },
  {
    id: "quant-full-section",
    title: "Full Section",
    description: "40-question timed quant section modeled on the GRE.",
    section: "quantitative",
    questionCount: 40,
    timeLimit: 47 * 60,
    questionIds: ids("q", 1, 40),
  },

  // ── WRITING ───────────────────────────────────────────────────────────────
  {
    id: "writing-practice-1",
    title: "Practice Test 1",
    description: "One issue task and one argument task—standard AWA format.",
    section: "writing",
    questionCount: 2,
    timeLimit: 60 * 60,
    questionIds: ["w1", "w51"],
  },
  {
    id: "writing-practice-2",
    title: "Practice Test 2",
    description: "Alternate issue and argument prompts for a second timed session.",
    section: "writing",
    questionCount: 2,
    timeLimit: 60 * 60,
    questionIds: ["w2", "w52"],
  },
  {
    id: "writing-issue-focus",
    title: "Issue Task Set",
    description: "Four issue prompts to practice thesis development and counterarguments.",
    section: "writing",
    questionCount: 4,
    timeLimit: 120 * 60,
    questionIds: ids("w", 1, 4),
  },
  {
    id: "writing-argument-focus",
    title: "Argument Task Set",
    description: "Four argument prompts focused on identifying assumptions and evidence gaps.",
    section: "writing",
    questionCount: 4,
    timeLimit: 120 * 60,
    questionIds: ids("w", 51, 4),
  },
  {
    id: "writing-quick",
    title: "Single Essay Drill",
    description: "One issue prompt—ideal for a 30-minute writing workout.",
    section: "writing",
    questionCount: 1,
    timeLimit: 30 * 60,
    questionIds: ["w10"],
  },
  {
    id: "writing-full-section",
    title: "Full AWA Section",
    description: "Two essays (issue + argument) in one sitting, as on test day.",
    section: "writing",
    questionCount: 2,
    timeLimit: 60 * 60,
    questionIds: ["w5", "w55"],
  },
];

export function getTestsBySection(section: Section): TestDefinition[] {
  return tests.filter((t) => t.section === section);
}

export function getTestById(id: string): TestDefinition | undefined {
  return tests.find((t) => t.id === id);
}

export function getQuestionsForTest(testId: string) {
  const test = getTestById(testId);
  if (!test) return [];
  return getQuestionsByIds(test.questionIds);
}

export function getTotalQuestionCount(): number {
  return verbalQuestions.length + quantitativeQuestions.length + writingQuestions.length;
}

export const sectionMeta: Record<Section, { title: string; description: string }> = {
  verbal: {
    title: "Verbal Reasoning",
    description: "Reading comprehension, text completion, and sentence equivalence.",
  },
  quantitative: {
    title: "Quantitative Reasoning",
    description: "Arithmetic, algebra, geometry, and data analysis.",
  },
  writing: {
    title: "Analytical Writing",
    description: "Issue and argument essay prompts with rubric-style guidance.",
  },
};

export function formatTime(seconds: number): string {
  if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${seconds / 3600} hr`;
  }
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}
