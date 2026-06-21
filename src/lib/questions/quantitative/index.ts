import { Question } from "../../types";
import { arithmeticQuestions } from "./arithmetic";
import { algebraQuestions } from "./algebra";
import { geometryQuestions } from "./geometry";
import { dataanalysisQuestions } from "./data-analysis";

export { arithmeticQuestions } from "./arithmetic";
export { algebraQuestions } from "./algebra";
export { geometryQuestions } from "./geometry";
export { dataanalysisQuestions } from "./data-analysis";

export const quantitativeQuestions: Question[] = [
  ...arithmeticQuestions,
  ...algebraQuestions,
  ...geometryQuestions,
  ...dataanalysisQuestions,
];
