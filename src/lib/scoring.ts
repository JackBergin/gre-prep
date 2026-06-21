import { Answer, Question, QuestionResult, ScoreResult, Section } from "./types";

function normalizeAnswer(a: string | string[] | null | undefined): string {
  if (a == null) return "";
  if (Array.isArray(a)) return [...a].sort().join("|");
  return a.trim();
}

function isCorrect(question: Question, selected: string | string[] | null): boolean {
  if (selected == null || selected === "") return false;
  if (question.section === "writing") return false; // writing is manually scored
  return normalizeAnswer(selected) === normalizeAnswer(question.correctAnswer);
}

// GRE Verbal / Quant: scaled 130–170
function toScaledScore(correct: number, total: number): number {
  if (total === 0) return 130;
  const pct = correct / total;
  return Math.round(130 + pct * 40);
}

export function calculateScore(
  section: Section,
  questions: Question[],
  answers: Answer[]
): ScoreResult {
  const answerMap = new Map<string, Answer>(answers.map((a) => [a.questionId, a]));

  const results: QuestionResult[] = questions.map((q) => {
    const answer = answerMap.get(q.id);
    const selected = answer?.selectedAnswer ?? null;
    return {
      question: q,
      selectedAnswer: selected,
      isCorrect: isCorrect(q, selected),
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const skippedCount = results.filter((r) => r.selectedAnswer == null || r.selectedAnswer === "").length;
  const incorrectCount = results.length - correctCount - skippedCount;

  return {
    section,
    totalQuestions: questions.length,
    correctCount,
    incorrectCount,
    skippedCount,
    scaledScore: section === "writing" ? 0 : toScaledScore(correctCount, questions.length),
    results,
  };
}
