export type Intensity = "subtle" | "balanced" | "vivid";

export const INTENSITY: Intensity = "balanced";

const BALANCED = {
  heroParticleCount: { desktop: 72, mobile: 36 },
  heroSpeed: 0.28,
  heroConnectionDist: 120,
  heroParallax: 0.04,
  thumbParticleCount: { desktop: 14, mobile: 8 },
  thumbSpeed: 0.22,
  maxDpr: 2,
  slimeMoldAgents: { desktop: 3000, mobile: 1200 },
  slimeMoldSpeed: 1.0,
};

const INTENSITY_MAP = {
  subtle: {
    heroParticleCount: { desktop: 48, mobile: 24 },
    heroSpeed: 0.2,
    heroConnectionDist: 100,
    heroParallax: 0.025,
    thumbParticleCount: { desktop: 10, mobile: 6 },
    thumbSpeed: 0.15,
    maxDpr: 1.5,
    slimeMoldAgents: { desktop: 2000, mobile: 800 },
    slimeMoldSpeed: 0.8,
  },
  balanced: BALANCED,
  vivid: {
    heroParticleCount: { desktop: 100, mobile: 50 },
    heroSpeed: 0.38,
    heroConnectionDist: 140,
    heroParallax: 0.06,
    thumbParticleCount: { desktop: 18, mobile: 10 },
    thumbSpeed: 0.3,
    maxDpr: 2,
    slimeMoldAgents: { desktop: 5000, mobile: 2000 },
    slimeMoldSpeed: 1.2,
  },
} as const;

export function getArtConfig(isMobile: boolean) {
  const cfg = INTENSITY_MAP[INTENSITY];
  return {
    heroParticleCount: isMobile ? cfg.heroParticleCount.mobile : cfg.heroParticleCount.desktop,
    heroSpeed: cfg.heroSpeed,
    heroConnectionDist: cfg.heroConnectionDist,
    heroParallax: cfg.heroParallax,
    thumbParticleCount: isMobile ? cfg.thumbParticleCount.mobile : cfg.thumbParticleCount.desktop,
    thumbSpeed: cfg.thumbSpeed,
    maxDpr: cfg.maxDpr,
    slimeMoldAgents: isMobile ? cfg.slimeMoldAgents.mobile : cfg.slimeMoldAgents.desktop,
    slimeMoldSpeed: cfg.slimeMoldSpeed,
  };
}
