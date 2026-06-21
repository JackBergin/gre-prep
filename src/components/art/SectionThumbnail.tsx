"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

export default function SectionThumbnail({ section }: SectionThumbnailProps) {
  // SSR-safe defaults so the first client render matches the server; read real
  // environment after mount to avoid hydration drift.
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    setMobile(isMobileViewport());

    const cleanups = [
      subscribeReducedMotion(setReducedMotion),
      subscribeVisibility(setVisible),
      subscribeTheme(() => setThemeKey((k) => k + 1)),
    ];

    const onResize = () => setMobile(isMobileViewport());
    window.addEventListener("resize", onResize);

    return () => {
      cleanups.forEach((fn) => fn());
      window.removeEventListener("resize", onResize);
    };
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
