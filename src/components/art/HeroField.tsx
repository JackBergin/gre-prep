"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArtCanvas from "./ArtCanvas";
import { createHeroFieldSketch } from "./sketches/heroField";
import { getArtConfig } from "@/lib/art/config";
import {
  isMobileViewport,
  prefersReducedMotion,
  subscribeReducedMotion,
  subscribeTheme,
  subscribeVisibility,
} from "@/lib/art/motion";

export default function HeroField() {
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(() => isMobileViewport());
  const [themeKey, setThemeKey] = useState(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      const el = containerRef.current?.closest(".hero-section");
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
    return createHeroFieldSketch({
      particleCount: config.heroParticleCount,
      speed: config.heroSpeed,
      connectionDist: config.heroConnectionDist,
      parallaxStrength: config.heroParallax,
      interactive: !mobile,
      getMouseNorm: () => mouseRef.current,
      getSize: () => {
        const el = containerRef.current?.closest(".hero-section");
        return {
          width: el?.clientWidth ?? window.innerWidth,
          height: el?.clientHeight ?? 420,
        };
      },
    });
  }, [config, mobile]);

  if (reducedMotion) {
    return <div className="hero-field hero-field--static" aria-hidden="true" />;
  }

  return (
    <div ref={containerRef} className="hero-field" key={themeKey}>
      <ArtCanvas sketchFactory={sketchFactory} paused={!visible} />
    </div>
  );
}
