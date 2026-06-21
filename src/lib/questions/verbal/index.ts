import { Question } from "../../types";
import { readingComprehensionQuestions } from "./reading-comprehension";
import { textCompletionQuestions } from "./text-completion";
import { sentenceEquivalenceQuestions } from "./sentence-equivalence";

export { passages } from "./passages";
export { readingComprehensionQuestions } from "./reading-comprehension";
export { textCompletionQuestions } from "./text-completion";
export { sentenceEquivalenceQuestions } from "./sentence-equivalence";

export const verbalQuestions: Question[] = [
  ...readingComprehensionQuestions,
  ...textCompletionQuestions,
  ...sentenceEquivalenceQuestions,
];
