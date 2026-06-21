import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import QuizPage from "@/app/quiz/[section]/page";
import { getTestsBySection } from "@/lib/tests";
import {
  sampleMultiSelectQuestion,
  sampleVerbalQuestion,
  sampleWritingQuestion,
} from "../../fixtures/questions";

const mockPush = vi.fn();
const mockUseParams = vi.fn(() => ({ section: "verbal" }));
const mockUseSearchParams = vi.fn(() => new URLSearchParams());

vi.mock("next/navigation", () => ({
  useParams: (...args: unknown[]) => mockUseParams(...args),
  useSearchParams: (...args: unknown[]) => mockUseSearchParams(...args),
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => "/quiz/verbal"),
}));

const mockQuestions = [
  sampleVerbalQuestion,
  {
    ...sampleMultiSelectQuestion,
    options: sampleMultiSelectQuestion.options ?? [],
  },
];

const server = setupServer(
  http.get("/api/questions", ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get("section") === "verbal") {
      return HttpResponse.json(mockQuestions);
    }
    return HttpResponse.json([]);
  }),
  http.post("/api/score", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      section: body.section,
      totalQuestions: mockQuestions.length,
      correctCount: 1,
      incorrectCount: 1,
      skippedCount: 0,
      scaledScore: 150,
      results: [],
    });
  })
);

describe("Quiz page smoke", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    mockPush.mockClear();
    mockUseParams.mockReturnValue({ section: "verbal" });
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    sessionStorage.clear();
  });
  afterAll(() => server.close());

  it("loads questions and advances through the quiz", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    expect(screen.getByText(/Loading questions/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(sampleVerbalQuestion.prompt)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: sampleVerbalQuestion.options![0] }));
    await user.click(screen.getByRole("button", { name: "Next →" }));

    expect(screen.getByText(/Select TWO answers/i)).toBeInTheDocument();
    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
  });

  it("submits quiz and navigates to results", async () => {
    server.use(
      http.get("/api/questions", () => HttpResponse.json([sampleVerbalQuestion]))
    );

    const user = userEvent.setup();
    render(<QuizPage />);

    await waitFor(() => {
      expect(screen.getByText(sampleVerbalQuestion.prompt)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Submit Quiz" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/results");
    });
    expect(sessionStorage.getItem("quizResult")).toContain('"scaledScore":150');
  });

  it("shows empty state when API returns no questions", async () => {
    server.use(
      http.get("/api/questions", () => HttpResponse.json([]))
    );

    render(<QuizPage />);

    await waitFor(() => {
      expect(screen.getByText(/No questions found/i)).toBeInTheDocument();
    });
  });

  it("loads writing prompts with a response textarea and word count", async () => {
    mockUseParams.mockReturnValue({ section: "writing" });
    server.use(
      http.get("/api/questions", ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("section") === "writing") {
          return HttpResponse.json([sampleWritingQuestion]);
        }
        return HttpResponse.json([]);
      })
    );

    const user = userEvent.setup();
    render(<QuizPage />);

    await waitFor(() => {
      expect(screen.getByText(sampleWritingQuestion.prompt)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Write your essay here/i);
    await user.type(textarea, "One two three");

    expect(screen.getByText(/Word count: 3/i)).toBeInTheDocument();
  });

  it("navigates back to the previous question and restores answers", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

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

  it("fetches questions by test id when provided in search params", async () => {
    const writingTest = getTestsBySection("writing")[0];
    mockUseParams.mockReturnValue({ section: "writing" });
    mockUseSearchParams.mockReturnValue(new URLSearchParams(`test=${writingTest.id}`));

    server.use(
      http.get("/api/questions", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("test")).toBe(writingTest.id);
        return HttpResponse.json([sampleWritingQuestion]);
      })
    );

    render(<QuizPage />);

    await waitFor(() => {
      expect(screen.getByText(writingTest.title)).toBeInTheDocument();
    });
  });
});
