export type Section = "verbal" | "quantitative" | "writing";
export type QuestionType =
  | "reading-comprehension"
  | "text-completion"
  | "sentence-equivalence"
  | "arithmetic"
  | "algebra"
  | "geometry"
  | "data-analysis"
  | "issue-task"
  | "argument-task";

export interface Question {
  id: string;
  section: Section;
  type: QuestionType;
  prompt: string;
  passage?: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation: string;
}

export interface Answer {
  questionId: string;
  selectedAnswer: string | string[] | null;
}

export interface QuizSession {
  section: Section;
  questions: Question[];
  answers: Answer[];
  startedAt: number;
  timeLimit: number; // seconds
}

export interface QuestionResult {
  question: Question;
  selectedAnswer: string | string[] | null;
  isCorrect: boolean;
}

export interface ScoreResult {
  section: Section;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  scaledScore: number;
  results: QuestionResult[];
}

export interface ScoreRequest {
  section: Section;
  answers: Answer[];
}
