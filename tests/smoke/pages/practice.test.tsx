import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PracticePage from "@/app/practice/page";
import { getTestsBySection } from "@/lib/tests";

const verbalTests = getTestsBySection("verbal");

describe("Practice page smoke", () => {
  it("renders section tests from the local data and start links", () => {
    render(<PracticePage />);

    expect(screen.getByRole("heading", { name: /Practice Tests/i })).toBeInTheDocument();

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
