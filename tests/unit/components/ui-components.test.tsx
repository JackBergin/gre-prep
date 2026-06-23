import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProgressBar from "@/components/ui/ProgressBar";
import Chip from "@/components/ui/Chip";

describe("ProgressBar", () => {
  it("renders label and clamps fill width", () => {
    render(<ProgressBar value={150} label="Progress" />);

    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(document.querySelector(".progress-fill")).toHaveStyle({ width: "100%" });
  });

  it("clamps negative values to zero", () => {
    render(<ProgressBar value={-10} />);
    expect(document.querySelector(".progress-fill")).toHaveStyle({ width: "0%" });
  });
});

describe("Chip", () => {
  it("renders as span or button with active styling", () => {
    const { rerender } = render(<Chip as="span">Label</Chip>);
    expect(screen.getByText("Label").tagName).toBe("SPAN");

    rerender(<Chip active>Active</Chip>);
    expect(screen.getByRole("button", { name: "Active" })).toHaveClass("chip--active");
  });
});
