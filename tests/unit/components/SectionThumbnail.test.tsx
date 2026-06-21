import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SectionThumbnail from "@/components/art/SectionThumbnail";

const prefersReducedMotion = vi.fn(() => false);

vi.mock("@/lib/art/motion", () => ({
  prefersReducedMotion: () => prefersReducedMotion(),
  isMobileViewport: () => false,
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
  default: () => <div data-testid="art-canvas" />,
}));

describe("SectionThumbnail", () => {
  beforeEach(() => {
    prefersReducedMotion.mockReturnValue(false);
  });

  it.each(["verbal", "quantitative", "writing"] as const)(
    "renders animated thumbnail for %s section",
    (section) => {
      render(<SectionThumbnail section={section} />);

      expect(screen.getByTestId("art-canvas")).toBeInTheDocument();
      expect(document.querySelector(".section-thumbnail__overlay")).toBeInTheDocument();
    }
  );

  it("renders static variant when reduced motion is preferred", () => {
    prefersReducedMotion.mockReturnValue(true);

    render(<SectionThumbnail section="verbal" />);

    expect(screen.queryByTestId("art-canvas")).not.toBeInTheDocument();
    expect(document.querySelector(".section-thumbnail--static.section-thumbnail--verbal")).toBeInTheDocument();
  });
});
