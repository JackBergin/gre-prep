import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import NavBar from "@/components/layout/NavBar";

describe("NavBar", () => {
  it("highlights the active route", () => {
    vi.mocked(usePathname).mockReturnValue("/practice");

    render(<NavBar />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const practiceLink = screen.getByRole("link", { name: "Test Gallery" });

    expect(homeLink.querySelector(".chip")).not.toHaveClass("chip--active");
    expect(practiceLink.querySelector(".chip")).toHaveClass("chip--active");
  });

  it("highlights home when pathname is root", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<NavBar />);

    expect(screen.getByRole("link", { name: "Home" }).querySelector(".chip")).toHaveClass(
      "chip--active"
    );
  });
});
