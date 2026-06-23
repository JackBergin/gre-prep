import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HeroField from "@/components/art/HeroField";

const prefersReducedMotion = vi.fn(() => false);
const isMobileViewport = vi.fn(() => false);

vi.mock("@/lib/art/motion", () => ({
  prefersReducedMotion: () => prefersReducedMotion(),
  isMobileViewport: () => isMobileViewport(),
  subscribeReducedMotion: (cb: (reduced: boolean) => void) => {
    cb(prefersReducedMotion());
    return () => {};
  },
  subscribeVisibility: (cb: (visible: boolean) => void) => {
    cb(true);
    return () => {};
  },
  subscribeTheme: () => () => {},
}));

vi.mock("@/components/art/ArtCanvas", () => ({
  default: ({ paused }: { paused?: boolean }) => (
    <div data-testid="art-canvas" data-paused={String(paused)} />
  ),
}));

describe("HeroField", () => {
  beforeEach(() => {
    prefersReducedMotion.mockReturnValue(false);
    isMobileViewport.mockReturnValue(false);
  });

  it("renders animated canvas when motion is allowed", () => {
    render(<HeroField />);

    expect(screen.getByTestId("art-canvas")).toBeInTheDocument();
    expect(document.querySelector(".hero-field")).toBeInTheDocument();
  });

  it("renders static placeholder when reduced motion is preferred", () => {
    prefersReducedMotion.mockReturnValue(true);

    render(<HeroField />);

    expect(screen.queryByTestId("art-canvas")).not.toBeInTheDocument();
    expect(document.querySelector(".hero-field--static")).toBeInTheDocument();
  });
});
