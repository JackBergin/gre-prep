import { render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Timer from "@/components/quiz/Timer";

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders formatted starting time", () => {
    render(<Timer seconds={125} />);

    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("2:05")).toBeInTheDocument();
  });

  it("counts down every second", () => {
    render(<Timer seconds={10} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("0:07")).toBeInTheDocument();
  });

  it("calls onExpire when time reaches zero", () => {
    const onExpire = vi.fn();
    render(<Timer seconds={2} onExpire={onExpire} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onExpire).toHaveBeenCalledOnce();
  });

  it("resets when seconds prop changes", () => {
    const { rerender } = render(<Timer seconds={30} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("0:25")).toBeInTheDocument();

    rerender(<Timer seconds={60} />);
    expect(screen.getByText("1:00")).toBeInTheDocument();
  });
});
