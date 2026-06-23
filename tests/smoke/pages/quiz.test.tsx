import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Question } from "@/lib/types";
import {
  sampleMultiSelectQuestion,
  sampleVerbalQuestion,
  sampleWritingQuestion,
} from "../../fixtures/questions";

const mockPush = vi.fn();
const mockUseSearchParams = vi.fn(() => new URLSearchParams());

vi.mock("next/navigation", () => ({
  useSearchParams: (...args: unknown[]) => mockUseSearchParams(...args),
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => "/quiz/verbal"),
}));

// Questions are served from the static local bank; control what each loader
// returns so the smoke tests can exercise specific scenarios.
let currentQuestions: Question[] = [];
const getQuestionsForTestSpy = vi.fn<(testId: string) => Question[]>(() => currentQuestions);

vi.mock("@/lib/questions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/questions")>();
  return {
    ...actual,
    getQuestionsBySection: () => currentQuestions,
    getQuestionsByIds: (ids: string[]) =>
      currentQuestions.filter((q) => ids.includes(q.id)),
  };
});

vi.mock("@/lib/tests", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/tests")>();
  return {
    ...actual,
    getQuestionsForTest: (testId: string) => getQuestionsForTestSpy(testId),
  };
});

import QuizClient from "@/app/quiz/[section]/QuizClient";

const mockQuestions: Question[] = [
  sampleVerbalQuestion,
  {
    ...sampleMultiSelectQuestion,
    options: sampleMultiSelectQuestion.options ?? [],
  },
];

describe("Quiz page smoke", () => {
  afterEach(() => {
    mockPush.mockClear();
    getQuestionsForTestSpy.mockClear();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    currentQuestions = [];
    sessionStorage.clear();
  });

  it("loads questions and advances through the quiz", async () => {
    currentQuestions = mockQuestions;
    const user = userEvent.setup();
    render(<QuizClient section="verbal" />);

    await waitFor(() => {
      expect(screen.getByText(sampleVerbalQuestion.prompt)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: sampleVerbalQuestion.options![0] }));
    await user.click(screen.getByRole("button", { name: "Next →" }));

    expect(screen.getByText(/Select TWO answers/i)).toBeInTheDocument();
    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
  });

  it("submits quiz and navigates to results", async () => {
    currentQuestions = [sampleVerbalQuestion];
    const user = userEvent.setup();
    render(<QuizClient section="verbal" />);

    await waitFor(() => {
      expect(screen.getByText(sampleVerbalQuestion.prompt)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Submit Quiz" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/results");
    });
    expect(sessionStorage.getItem("quizResult")).toContain('"section":"verbal"');
  });

  it("shows empty state when there are no questions", async () => {
    currentQuestions = [];
    render(<QuizClient section="verbal" />);

    await waitFor(() => {
      expect(screen.getByText(/No questions found/i)).toBeInTheDocument();
    });
  });

  it("loads writing prompts with a response textarea and word count", async () => {
    currentQuestions = [sampleWritingQuestion];
    const user = userEvent.setup();
    render(<QuizClient section="writing" />);

    await waitFor(() => {
      expect(screen.getByText(sampleWritingQuestion.prompt)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Write your essay here/i);
    await user.type(textarea, "One two three");

    expect(screen.getByText(/Word count: 3/i)).toBeInTheDocument();
  });

  it("navigates back to the previous question and restores answers", async () => {
    currentQuestions = mockQuestions;
    const user = userEvent.setup();
    render(<QuizClient section="verbal" />);

    await waitFor(() => {
      expect(screen.getByText(sampleVerbalQuestion.prompt)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: sampleVerbalQuestion.options![0] }));
    await user.click(screen.getByRole("button", { name: "Next →" }));

    await waitFor(() => {
      expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "← Back" }));

    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: sampleVerbalQuestion.options![0] })
    ).toHaveClass("answer-option--selected");
  });

  it("loads questions by test id when provided in search params", async () => {
    currentQuestions = [sampleWritingQuestion];
    mockUseSearchParams.mockReturnValue(new URLSearchParams("test=writing-practice-1"));

    render(<QuizClient section="writing" />);

    await waitFor(() => {
      expect(screen.getByText(sampleWritingQuestion.prompt)).toBeInTheDocument();
    });
    expect(getQuestionsForTestSpy).toHaveBeenCalledWith("writing-practice-1");
  });
});
