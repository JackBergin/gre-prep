"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Section } from "@/lib/types";
import ArtCanvas from "./ArtCanvas";
import { createVerbalSketch } from "./sketches/verbalSketch";
import { createQuantSketch } from "./sketches/quantSketch";
import { createWritingSketch } from "./sketches/writingSketch";
import { getArtConfig } from "@/lib/art/config";
import {
  isMobileViewport,
  prefersReducedMotion,
  subscribeReducedMotion,
  subscribeTheme,
  subscribeVisibility,
} from "@/lib/art/motion";

const sketchMap = {
  verbal: createVerbalSketch,
  quantitative: createQuantSketch,
  writing: createWritingSketch,
} as const;

interface SectionThumbnailProps {
  section: Section;
}

export default function SectionThumbnail({ section }: SectionThumbnailProps) {
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(() => isMobileViewport());
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
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
    const create = sketchMap[section];
    return create({
      particleCount: config.thumbParticleCount,
      speed: config.thumbSpeed,
    });
  }, [section, config]);

  if (reducedMotion) {
    return (
      <div className="section-thumbnail" aria-hidden="true">
        <div
          className="w-full h-full flex items-center justify-center text-lg font-bold"
          style={{ color: "var(--accent)" }}
        >
          {section === "verbal" ? "✦" : section === "quantitative" ? "∑" : "✎"}
        </div>
      </div>
    );
  }

  return (
    <div className="section-thumbnail" key={themeKey}>
      <ArtCanvas sketchFactory={sketchFactory} paused={!visible} />
      <div className="section-thumbnail__overlay" />
    </div>
  );
}
