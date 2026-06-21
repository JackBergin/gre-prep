"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArtCanvas from "./ArtCanvas";
import { createSlimeMoldSketch } from "./sketches/slimeMoldSketch";
import { getArtConfig } from "@/lib/art/config";
import {
  isMobileViewport,
  prefersReducedMotion,
  subscribeReducedMotion,
  subscribeTheme,
  subscribeVisibility,
} from "@/lib/art/motion";

export default function HeroField() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    setMobile(isMobileViewport());

    const cleanups = [
      subscribeReducedMotion(setReducedMotion),
      subscribeVisibility(setVisible),
      subscribeTheme(() => setThemeKey((k) => k + 1)),
    ];

    const onResize = () => {
      setMobile(isMobileViewport());
      setThemeKey((k) => k + 1);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cleanups.forEach((fn) => fn());
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const config = useMemo(() => getArtConfig(mobile), [mobile]);

  const slimeMoldFactory = useCallback(() => {
    return createSlimeMoldSketch({
      agentCount: config.slimeMoldAgents,
      speed: config.slimeMoldSpeed,
      getSize: () => ({
        width: containerRef.current?.clientWidth ?? 640,
        height: containerRef.current?.clientHeight ?? 220,
      }),
    });
  }, [config]);

  if (reducedMotion) {
    return <div className="hero-field hero-field--static" aria-hidden="true" />;
  }

  return (
    <div ref={containerRef} className="hero-field" key={themeKey}>
      <ArtCanvas sketchFactory={slimeMoldFactory} paused={!visible} />
    </div>
  );
}
