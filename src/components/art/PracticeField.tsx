"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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

export default function PracticeField() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const visible = useSyncExternalStore(subscribeVisible, getVisibilitySnapshot, () => true);
  const mobile = useSyncExternalStore(subscribeViewport, isMobileViewport, () => false);
  const [themeKey, setThemeKey] = useState(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Remount the canvas when the theme or viewport size changes so the sketch
  // re-reads colors and dimensions.
  useEffect(() => {
    const unsubscribeTheme = subscribeTheme(() => setThemeKey((k) => k + 1));
    const onResize = () => setThemeKey((k) => k + 1);
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribeTheme();
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
