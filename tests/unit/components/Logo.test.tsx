import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Logo from "@/components/layout/Logo";

describe("Logo", () => {
  it("renders the prism tile mark with triangle and centre dot", () => {
    const { container } = render(<Logo size={48} className="brand" />);

    const svg = container.querySelector("svg.logo.brand");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".logo__box")).toBeInTheDocument();
    expect(container.querySelector(".logo__triangle")).toBeInTheDocument();
    expect(container.querySelector(".logo__dot")).toBeInTheDocument();
  });

  it("uses default size when none is provided", () => {
    const { container } = render(<Logo />);

    expect(container.querySelector("svg")).toHaveAttribute("width", "40");
  });
});
