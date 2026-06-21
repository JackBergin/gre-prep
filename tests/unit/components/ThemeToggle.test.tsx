import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ThemeToggle from "@/components/layout/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("toggles theme and persists preference", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /Switch to dark mode/i });
    expect(button).toHaveTextContent("☾");

    await user.click(button);

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(screen.getByRole("button", { name: /Switch to light mode/i })).toHaveTextContent("☀");
  });

  it("reads stored theme on mount", () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");

    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /Switch to light mode/i })).toBeInTheDocument();
  });

  it("follows system theme changes when no stored preference exists", () => {
    const listeners = new Map<string, () => void>();
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === "change") listeners.set(query, handler);
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /Switch to light mode/i })).toHaveTextContent("☀");

    listeners.get("(prefers-color-scheme: dark)")?.();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
