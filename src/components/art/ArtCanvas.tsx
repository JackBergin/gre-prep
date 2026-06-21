"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";
import { getEffectiveDpr } from "@/lib/art/motion";

interface ArtCanvasProps {
  sketchFactory: () => (p: p5) => void;
  className?: string;
  paused?: boolean;
}

export default function ArtCanvas({
  sketchFactory,
  className = "art-canvas",
  paused = false,
}: ArtCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    (async () => {
      const P5 = (await import("p5")).default;
      if (cancelled) return;

      const baseSketch = sketchFactory();

      instanceRef.current = new P5((p: p5) => {
        baseSketch(p);

        const originalSetup = p.setup?.bind(p);
        const originalDraw = p.draw?.bind(p);

        p.setup = () => {
          originalSetup?.();
          p.pixelDensity(getEffectiveDpr());
        };

        p.draw = () => {
          if (pausedRef.current) return;
          originalDraw?.();
        };
      }, container);
    })();

    return () => {
      cancelled = true;
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, [sketchFactory]);

  useEffect(() => {
    if (!instanceRef.current) return;
    if (paused) {
      instanceRef.current.noLoop();
    } else {
      instanceRef.current.loop();
    }
  }, [paused]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
