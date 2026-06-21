import { Question } from "../../types";
import { issueTaskQuestions } from "./issue-task";
import { argumentTaskQuestions } from "./argument-task";

export { issueTaskQuestions } from "./issue-task";
export { argumentTaskQuestions } from "./argument-task";

export const writingQuestions: Question[] = [
  ...issueTaskQuestions,
  ...argumentTaskQuestions,
];
