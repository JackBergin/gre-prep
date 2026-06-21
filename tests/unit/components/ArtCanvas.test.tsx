import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArtCanvas from "@/components/art/ArtCanvas";

const mockRemove = vi.fn();
const mockNoLoop = vi.fn();
const mockLoop = vi.fn();
const mockPixelDensity = vi.fn();
const mockSetup = vi.fn();
const mockDraw = vi.fn();

vi.mock("p5", () => ({
  default: vi.fn(function P5Mock(sketch: (p: Record<string, unknown>) => void) {
    const p = {
      setup: mockSetup,
      draw: mockDraw,
      pixelDensity: mockPixelDensity,
      noLoop: mockNoLoop,
      loop: mockLoop,
      remove: mockRemove,
    };
    sketch(p);
    if (typeof p.setup === "function") {
      p.setup();
    }
    return p;
  }),
}));

describe("ArtCanvas", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("mounts a p5 sketch and cleans up on unmount", async () => {
    const sketchFactory = vi.fn(() => (p: Record<string, unknown>) => {
      p.setup = mockSetup;
      p.draw = mockDraw;
    });

    const { unmount, container } = render(
      <ArtCanvas sketchFactory={sketchFactory} className="test-canvas" />
    );

    await waitFor(() => {
      expect(sketchFactory).toHaveBeenCalled();
    });

    expect(container.querySelector(".test-canvas")).toHaveAttribute("aria-hidden", "true");
    expect(mockSetup).toHaveBeenCalled();
    expect(mockPixelDensity).toHaveBeenCalled();

    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });

  it("pauses and resumes the sketch loop", async () => {
    const sketchFactory = vi.fn(() => () => {});

    const { rerender } = render(<ArtCanvas sketchFactory={sketchFactory} paused={true} />);

    await waitFor(() => {
      expect(sketchFactory).toHaveBeenCalled();
    });

    rerender(<ArtCanvas sketchFactory={sketchFactory} paused={false} />);

    await waitFor(() => {
      expect(mockLoop).toHaveBeenCalled();
    });

    rerender(<ArtCanvas sketchFactory={sketchFactory} paused={true} />);

    await waitFor(() => {
      expect(mockNoLoop).toHaveBeenCalled();
    });
  });
});
