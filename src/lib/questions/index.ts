import { Question, Section } from "../types";
import { verbalQuestions } from "./verbal";
import { quantitativeQuestions } from "./quantitative";
import { writingQuestions } from "./writing";

export { verbalQuestions, quantitativeQuestions, writingQuestions };
export * from "./verbal";
export * from "./quantitative";
export * from "./writing";

export const questions: Question[] = [
  ...verbalQuestions,
  ...quantitativeQuestions,
  ...writingQuestions,
];

export function getQuestionsBySection(section: string): Question[] {
  return questions.filter((q) => q.section === section);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function getQuestionCountBySection(section?: Section): number | Record<Section, number> {
  if (section) {
    return getQuestionsBySection(section).length;
  }
  return {
    verbal: verbalQuestions.length,
    quantitative: quantitativeQuestions.length,
    writing: writingQuestions.length,
  };
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const map = new Map(questions.map((q) => [q.id, q]));
  return ids.map((id) => map.get(id)).filter((q): q is Question => q !== undefined);
}
