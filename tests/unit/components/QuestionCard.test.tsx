import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import QuestionCard from "@/components/quiz/QuestionCard";
import {
  samplePassageQuestion,
  sampleVerbalQuestion,
  sampleWritingQuestion,
} from "../../fixtures/questions";

describe("QuestionCard", () => {
  it("renders question type, index, and prompt", () => {
    render(<QuestionCard question={sampleVerbalQuestion} index={2} total={10} />);

    expect(screen.getByText("Text Completion")).toBeInTheDocument();
    expect(screen.getByText("Question 3 of 10")).toBeInTheDocument();
    expect(screen.getByText(sampleVerbalQuestion.prompt)).toBeInTheDocument();
  });

  it("renders passage content when provided", () => {
    render(<QuestionCard question={samplePassageQuestion} index={0} total={5} />);

    expect(screen.getByText("Passage")).toBeInTheDocument();
    expect(screen.getByText(samplePassageQuestion.passage!)).toBeInTheDocument();
    expect(screen.getByText("Reading Comprehension")).toBeInTheDocument();
  });

  it("falls back to raw type label for unknown types", () => {
    render(
      <QuestionCard
        question={{ ...sampleWritingQuestion, type: "issue-task" }}
        index={0}
        total={1}
      />
    );

    expect(screen.getByText("Issue Task")).toBeInTheDocument();
  });
});
