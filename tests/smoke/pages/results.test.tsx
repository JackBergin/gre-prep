import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ResultsPage from "@/app/results/page";
import { verbalScoreResult, writingScoreResult } from "../../fixtures/score-results";

describe("Results page smoke", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("prompts users to start a quiz when no results exist", () => {
    render(<ResultsPage />);

    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go to Practice/i })).toHaveAttribute(
      "href",
      "/practice"
    );
  });

  it("renders score summary and answer review from session storage", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("quizResult", JSON.stringify(verbalScoreResult));

    render(<ResultsPage />);

    expect(screen.getByRole("heading", { name: /Your Results/i })).toBeInTheDocument();
    expect(screen.getByText("Verbal Reasoning")).toBeInTheDocument();
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Practice Again/i })).toHaveAttribute(
      "href",
      "/practice"
    );

    await user.click(screen.getAllByRole("button", { name: /Show explanation/i })[0]);
    expect(screen.getByText(verbalScoreResult.results[0].question.explanation)).toBeInTheDocument();
  });

  it("renders writing responses and hides answer options", async () => {
    sessionStorage.setItem("quizResult", JSON.stringify(writingScoreResult));

    render(<ResultsPage />);

    expect(screen.getByText("Analytical Writing")).toBeInTheDocument();
    expect(screen.getByText("Your Response")).toBeInTheDocument();
    expect(
      screen.getByText(writingScoreResult.results[0].selectedAnswer as string)
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Show explanation/i })).toBeInTheDocument();
  });
});
