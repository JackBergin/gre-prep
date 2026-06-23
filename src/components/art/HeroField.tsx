"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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

export default function HeroField() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const visible = useSyncExternalStore(subscribeVisible, getVisibilitySnapshot, () => true);
  const mobile = useSyncExternalStore(subscribeViewport, isMobileViewport, () => false);
  const [themeKey, setThemeKey] = useState(0);
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
