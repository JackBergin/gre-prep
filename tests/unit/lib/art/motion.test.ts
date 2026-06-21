import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getEffectiveDpr,
  isMobileViewport,
  prefersReducedMotion,
  subscribeReducedMotion,
  subscribeTheme,
  subscribeVisibility,
} from "@/lib/art/motion";

function mockMatchMedia(matches: Record<string, boolean>) {
  return vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("motion utilities", () => {
  beforeEach(() => {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 3,
    });
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("detects reduced motion preference", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    expect(prefersReducedMotion()).toBe(true);
  });

  it("detects mobile viewport width", () => {
    mockMatchMedia({ "(max-width: 768px)": true });
    expect(isMobileViewport()).toBe(true);
  });

  it("caps device pixel ratio using art config", () => {
    mockMatchMedia({ "(max-width: 768px)": false });
    expect(getEffectiveDpr()).toBe(2);
  });

  it("notifies visibility subscribers", () => {
    const handler = vi.fn();
    const unsubscribe = subscribeVisibility(handler);

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(handler).toHaveBeenCalledWith(false);
    unsubscribe();
  });

  it("notifies reduced motion subscribers", () => {
    const handler = vi.fn();
    const mq = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    vi.mocked(window.matchMedia).mockReturnValue(mq as MediaQueryList);

    const unsubscribe = subscribeReducedMotion(handler);
    const changeHandler = mq.addEventListener.mock.calls[0][1] as () => void;
    mq.matches = true;
    changeHandler();

    expect(handler).toHaveBeenCalledWith(true);
    unsubscribe();
  });

  it("notifies theme subscribers when data-theme changes", async () => {
    const handler = vi.fn();
    const unsubscribe = subscribeTheme(handler);

    document.documentElement.setAttribute("data-theme", "dark");
    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalled();
    });

    unsubscribe();
  });

  it("uses mobile dpr cap on narrow viewports", () => {
    mockMatchMedia({ "(max-width: 768px)": true });
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 3,
    });

    expect(getEffectiveDpr()).toBe(2);
  });
});
