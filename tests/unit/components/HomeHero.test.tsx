import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomeHero from "@/components/home/HomeHero";

vi.mock("@/components/art/HeroField", () => ({
  default: () => <div data-testid="hero-field" />,
}));

describe("HomeHero", () => {
  it("renders headline, hero field, and child content", () => {
    render(
      <HomeHero headline={<h1>Test Headline</h1>}>
        <p>Hero description</p>
        <a href="/practice">Start</a>
      </HomeHero>
    );

    expect(screen.getByTestId("hero-field")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Test Headline" })).toBeInTheDocument();
    expect(screen.getByText("Hero description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start" })).toHaveAttribute("href", "/practice");
  });
});
