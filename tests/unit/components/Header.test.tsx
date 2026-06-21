import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/components/layout/Header";

describe("Header", () => {
  it("renders branding and primary navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "PrismPrep home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("PrismPrep")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Practice" })).toHaveAttribute("href", "/practice");
    expect(screen.getByRole("button", { name: /Switch to/i })).toBeInTheDocument();
  });
});
