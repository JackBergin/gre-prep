import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";
import type { SectionSketchOptions } from "./types";

interface Particle {
  x: number;
  baseY: number;
  size: number;
  speed: number;
  phase: number;
}

// Particles drift left-to-right along a few baselines, evoking lines of
// writing while matching the particle aesthetic of the other thumbnails.
const LINE_COUNT = 3;
const LINE_TOP = 13;
const LINE_GAP = 11;
const LEFT = 5;
const RIGHT = 43;

export function createWritingSketch(options: SectionSketchOptions): (p: p5) => void {
  let particles: Particle[] = [];
  let theme = readArtTheme();

  return (p: p5) => {
    function spawn(line: number, scatter: boolean): Particle {
      return {
        x: scatter ? p.random(LEFT, RIGHT) : LEFT,
        baseY: LINE_TOP + line * LINE_GAP,
        size: p.random(1.3, 2.3),
        speed: options.speed * p.random(1.1, 1.8),
        phase: p.random(p.TWO_PI),
      };
    }

    p.setup = () => {
      p.createCanvas(48, 48);
      particles = Array.from({ length: options.particleCount }, (_, i) =>
        spawn(i % LINE_COUNT, true)
      );
    };

    p.draw = () => {
      theme = readArtTheme();
      const [r, g, b] = theme.rayWritingRgb;
      p.background(p.color(theme.bg));
      p.noStroke();

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.x += particle.speed;
        particle.phase += 0.08;

        if (particle.x > RIGHT) {
          Object.assign(particle, spawn(i % LINE_COUNT, false));
        }

        const y = particle.baseY + p.sin(particle.phase) * 1.6;
        // Fade in from the left and out toward the right edge for a gentle,
        // travelling cadence.
        const edge = p.constrain(
          Math.min(particle.x - LEFT, RIGHT - particle.x) / 6,
          0,
          1
        );
        p.fill(r, g, b, theme.particleAlpha * 235 * edge);
        p.circle(particle.x, y, particle.size);
      }
    };
  };
}
