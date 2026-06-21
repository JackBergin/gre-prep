import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

vi.mock("@/components/art/HeroField", () => ({
  default: () => null,
}));

vi.mock("@/components/art/SectionThumbnail", () => ({
  default: ({ section }: { section: string }) => (
    <div data-testid={`section-thumb-${section}`} />
  ),
}));

describe("Home page smoke", () => {
  it("renders hero copy and section cards from the question bank", () => {
    render(<HomePage />);

    expect(screen.getByText(/Clarity from/i)).toBeInTheDocument();
    expect(screen.getByText(/Complexity\./i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Verbal Reasoning/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Quantitative Reasoning/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Analytical Writing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Browse Test Gallery/i })).toHaveAttribute(
      "href",
      "/practice"
    );
  });
});
