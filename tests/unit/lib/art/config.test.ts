import { describe, expect, it } from "vitest";
import { getArtConfig } from "@/lib/art/config";

describe("getArtConfig", () => {
  it("returns lower particle counts on mobile", () => {
    const desktop = getArtConfig(false);
    const mobile = getArtConfig(true);

    expect(mobile.heroParticleCount).toBeLessThan(desktop.heroParticleCount);
    expect(mobile.thumbParticleCount).toBeLessThan(desktop.thumbParticleCount);
  });

  it("includes motion and rendering limits", () => {
    const config = getArtConfig(false);

    expect(config.heroSpeed).toBeGreaterThan(0);
    expect(config.heroConnectionDist).toBeGreaterThan(0);
    expect(config.maxDpr).toBeGreaterThan(0);
    expect(config.thumbSpeed).toBeGreaterThan(0);
  });
});
