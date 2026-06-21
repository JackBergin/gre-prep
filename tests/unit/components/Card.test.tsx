import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Card from "@/components/ui/Card";

describe("Card", () => {
  it("renders children with default padding", () => {
    render(<Card>Card body</Card>);

    expect(screen.getByText("Card body")).toHaveClass("card", "p-6");
  });

  it("applies padding variants and extra class names", () => {
    const { rerender } = render(
      <Card padding="sm" data-testid="card">
        Small
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveClass("p-4");

    rerender(
      <Card padding="lg" className="extra">
        Large
      </Card>
    );
    expect(screen.getByText("Large")).toHaveClass("p-10", "extra");
  });
});
