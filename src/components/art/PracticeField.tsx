"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArtCanvas from "./ArtCanvas";
import { createHeroPrismParticlesSketch } from "./sketches/heroPrismParticles";
import { getArtConfig } from "@/lib/art/config";
import {
  isMobileViewport,
  prefersReducedMotion,
  subscribeReducedMotion,
  subscribeTheme,
  subscribeVisibility,
} from "@/lib/art/motion";

export default function PracticeField() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
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

  useEffect(() => {
    if (mobile || reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mobile, reducedMotion]);

  const config = useMemo(() => getArtConfig(mobile), [mobile]);

  const sketchFactory = useCallback(() => {
    return createHeroPrismParticlesSketch({
      particleCount: config.heroParticleCount,
      speed: config.heroSpeed,
      connectionDist: config.heroConnectionDist,
      parallaxStrength: config.heroParallax,
      interactive: !mobile,
      getMouseNorm: () => mouseRef.current,
      getSize: () => ({
        width: containerRef.current?.clientWidth ?? 640,
        height: containerRef.current?.clientHeight ?? 280,
      }),
    });
  }, [mobile, config]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="practice-field"
      key={themeKey}
      aria-hidden="true"
    >
      <ArtCanvas sketchFactory={sketchFactory} paused={!visible} />
    </div>
  );
}
