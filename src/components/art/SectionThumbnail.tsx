"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { sectionRayVar } from "@/lib/sections";
import type { Section } from "@/lib/types";
import ArtCanvas from "./ArtCanvas";
import { createQuantSketch } from "./sketches/quantSketch";
import { createVerbalSketch } from "./sketches/verbalSketch";
import { createWritingSketch } from "./sketches/writingSketch";
import { getArtConfig } from "@/lib/art/config";
import {
  isMobileViewport,
  prefersReducedMotion,
  subscribeReducedMotion,
  subscribeTheme,
  subscribeVisibility,
} from "@/lib/art/motion";

interface SectionThumbnailProps {
  section: Section;
}

const sectionSketchFactory = {
  verbal: createVerbalSketch,
  quantitative: createQuantSketch,
  writing: createWritingSketch,
} as const;

// Stable external-store adapters: browser environment reads are exposed as
// snapshots so React can subscribe without setting state inside an effect.
const subscribeMotion = (cb: () => void) => subscribeReducedMotion(() => cb());
const subscribeVisible = (cb: () => void) => subscribeVisibility(() => cb());
const subscribeViewport = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const getVisibilitySnapshot = () =>
  typeof document === "undefined" ? true : document.visibilityState === "visible";

export default function SectionThumbnail({ section }: SectionThumbnailProps) {
  // External-store snapshots keep the first client render matching the server
  // (SSR-safe defaults) while staying reactive without a set-state effect.
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const visible = useSyncExternalStore(subscribeVisible, getVisibilitySnapshot, () => true);
  const mobile = useSyncExternalStore(subscribeViewport, isMobileViewport, () => false);
  const [themeKey, setThemeKey] = useState(0);

  // Remount the canvas when the theme changes so the sketch re-reads colors.
  useEffect(() => {
    return subscribeTheme(() => setThemeKey((k) => k + 1));
  }, []);

  const config = useMemo(() => getArtConfig(mobile), [mobile]);

  const sketchFactory = useCallback(() => {
    return sectionSketchFactory[section]({
      particleCount: config.thumbParticleCount,
      speed: config.thumbSpeed,
    });
  }, [section, config]);

  if (reducedMotion) {
    return (
      <div
        className={`section-thumbnail section-thumbnail--static section-thumbnail--${section}`}
        aria-hidden="true"
        style={{ "--section-ray": sectionRayVar[section] } as React.CSSProperties}
      />
    );
  }

  return (
    <div
      className="section-thumbnail"
      key={themeKey}
      style={{ "--section-ray": sectionRayVar[section] } as React.CSSProperties}
    >
      <ArtCanvas sketchFactory={sketchFactory} paused={!visible} />
      <div className="section-thumbnail__overlay" />
    </div>
  );
}
