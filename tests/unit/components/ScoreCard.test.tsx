import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScoreCard from "@/components/quiz/ScoreCard";
import { verbalScoreResult, writingScoreResult } from "../../fixtures/score-results";

describe("ScoreCard", () => {
  it("renders verbal score summary and performance label", () => {
    render(<ScoreCard result={verbalScoreResult} />);

    expect(screen.getByText("Verbal Reasoning")).toBeInTheDocument();
    expect(screen.getByText(/Scaled score:/)).toBeInTheDocument();
    expect(screen.getByText("157")).toBeInTheDocument();
    expect(screen.getByText("Proficient")).toBeInTheDocument();
    expect(screen.getByText("67% correct")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
    expect(screen.getByText("Skipped")).toBeInTheDocument();
  });

  it("hides scaled score for writing sections", () => {
    render(<ScoreCard result={writingScoreResult} />);

    expect(screen.getByText("Analytical Writing")).toBeInTheDocument();
    expect(screen.queryByText(/Scaled score:/)).not.toBeInTheDocument();
    expect(screen.getByText("Needs Work")).toBeInTheDocument();
  });

  it("maps performance labels across score ranges", () => {
    const excellent = {
      ...verbalScoreResult,
      correctCount: 9,
      totalQuestions: 10,
    };
    const developing = {
      ...verbalScoreResult,
      correctCount: 5,
      totalQuestions: 10,
    };

    const { rerender } = render(<ScoreCard result={excellent} />);
    expect(screen.getByText("Excellent")).toBeInTheDocument();

    rerender(<ScoreCard result={developing} />);
    expect(screen.getByText("Developing")).toBeInTheDocument();
  });
});
