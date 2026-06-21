import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import Chip from "@/components/ui/Chip";

describe("GlassCard", () => {
  it("renders card and panel variants", () => {
    const { rerender } = render(<GlassCard>Card content</GlassCard>);
    expect(screen.getByText("Card content")).toHaveClass("glass-card");

    rerender(
      <GlassCard variant="panel" data-testid="panel">
        Panel content
      </GlassCard>
    );
    expect(screen.getByTestId("panel")).toHaveClass("glass-panel");
  });
});

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
