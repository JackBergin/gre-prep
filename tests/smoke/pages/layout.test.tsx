import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "@/app/layout";

describe("Root layout smoke", () => {
  it("exports page metadata", () => {
    expect(metadata.title).toBe("PrismPrep — Focused GRE Practice");
    expect(metadata.description).toMatch(/GRE prep/i);
  });

  it("renders shared header and page children inside main", () => {
    render(
      <RootLayout>
        <p>Page content</p>
      </RootLayout>,
      { container: document.body }
    );

    expect(screen.getByRole("link", { name: "PrismPrep home" })).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
    expect(document.querySelector("main.min-h-screen")).toContainElement(
      screen.getByText("Page content")
    );
  });
});
