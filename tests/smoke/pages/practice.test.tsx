import { render, screen, waitFor, within } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import PracticePage from "@/app/practice/page";
import { getTestsBySection } from "@/lib/tests";

const verbalTests = getTestsBySection("verbal");
const quantTests = getTestsBySection("quantitative");
const writingTests = getTestsBySection("writing");

const server = setupServer(
  http.get("/api/tests", ({ request }) => {
    const section = new URL(request.url).searchParams.get("section");
    const payload =
      section === "verbal"
        ? verbalTests
        : section === "quantitative"
          ? quantTests
          : section === "writing"
            ? writingTests
            : [];

    return HttpResponse.json(payload);
  })
);

describe("Practice page smoke", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("loads section tests from the API and renders start links", async () => {
    render(<PracticePage />);

    expect(screen.getByRole("heading", { name: /Practice Tests/i })).toBeInTheDocument();
    expect(screen.getByText(/Loading tests/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading tests/i)).not.toBeInTheDocument();
    });

    const verbalSection = document.getElementById("verbal");
    expect(verbalSection).not.toBeNull();
    expect(
      within(verbalSection!).getByRole("heading", { name: verbalTests[0].title, level: 3 })
    ).toBeInTheDocument();
    expect(
      document.querySelector(`a[href="/quiz/verbal?test=${verbalTests[0].id}"]`)
    ).toBeInTheDocument();
  });
});
