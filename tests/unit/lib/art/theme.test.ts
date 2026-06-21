import { beforeEach, describe, expect, it, vi } from "vitest";
import { readArtTheme } from "@/lib/art/theme";

describe("readArtTheme", () => {
  beforeEach(() => {
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      getPropertyValue: (name: string) => {
        const values: Record<string, string> = {
          "--bg": "#E0E5EC",
          "--accent": "#5B7CFA",
          "--ink": "#41485A",
          "--art-opacity": "0.55",
          "--art-particle-alpha": "0.35",
          "--prism-beam-alpha": "0.45",
          "--prism-ray-verbal": "#7c3aed",
          "--prism-ray-quant": "#0891b2",
          "--prism-ray-writing": "#ea580c",
        };
        return values[name] ?? "";
      },
    } as CSSStyleDeclaration);
  });

  it("reads css variables into an art theme object", () => {
    const theme = readArtTheme();

    expect(theme.bg).toBe("#E0E5EC");
    expect(theme.accent).toBe("#5B7CFA");
    expect(theme.ink).toBe("#41485A");
    expect(theme.artOpacity).toBe(0.55);
    expect(theme.particleAlpha).toBe(0.35);
    expect(theme.prismBeamAlpha).toBe(0.45);
    expect(theme.rayVerbal).toBe("#7c3aed");
    expect(theme.rayQuant).toBe("#0891b2");
    expect(theme.rayWriting).toBe("#ea580c");
  });

  it("parses rgb tuples from css colors", () => {
    const theme = readArtTheme();

    expect(theme.accentRgb).toHaveLength(3);
    expect(theme.inkRgb).toHaveLength(3);
    expect(theme.rayVerbalRgb.every((value) => value >= 0 && value <= 255)).toBe(true);
  });

  it("falls back when canvas context is unavailable", () => {
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      const element = document.createElementNS("http://www.w3.org/1999/xhtml", tagName);
      if (tagName === "canvas") {
        Object.defineProperty(element, "getContext", {
          value: () => null,
        });
      }
      return element as HTMLCanvasElement;
    });

    const theme = readArtTheme();

    expect(theme.accentRgb).toEqual([91, 124, 250]);
  });
});
