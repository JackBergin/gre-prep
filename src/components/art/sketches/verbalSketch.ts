import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";
import type { SectionSketchOptions } from "./types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
}

const CENTER = { x: 24, y: 24 };
const CORNERS = [
  { x: 5, y: 5 },
  { x: 43, y: 5 },
  { x: 5, y: 43 },
  { x: 43, y: 43 },
];

export function createVerbalSketch(options: SectionSketchOptions): (p: p5) => void {
  let particles: Particle[] = [];
  let theme = readArtTheme();

  return (p: p5) => {
    function spawn(scatter: boolean): Particle {
      const corner = CORNERS[Math.floor(p.random(CORNERS.length))];
      const angle =
        p.atan2(CENTER.y - corner.y, CENTER.x - corner.x) + p.random(-0.16, 0.16);
      const speed = options.speed * p.random(1.1, 1.8);
      const t = scatter ? p.random(0, 1) : 0;
      return {
        x: p.lerp(corner.x, CENTER.x, t) + p.random(-1.5, 1.5),
        y: p.lerp(corner.y, CENTER.y, t) + p.random(-1.5, 1.5),
        vx: p.cos(angle) * speed,
        vy: p.sin(angle) * speed,
        size: p.random(1.3, 2.3),
        age: scatter ? p.random(12, 40) : 0,
      };
    }

    p.setup = () => {
      p.createCanvas(48, 48);
      particles = Array.from({ length: options.particleCount }, () => spawn(true));
    };

    p.draw = () => {
      theme = readArtTheme();
      const [r, g, b] = theme.rayVerbalRgb;
      p.background(p.color(theme.bg));
      p.noStroke();

      // Soft luminous core where the streams converge.
      const pulse = 3 + p.sin(p.frameCount * 0.05) * 0.7;
      p.fill(r, g, b, theme.particleAlpha * 70);
      p.circle(CENTER.x, CENTER.y, pulse * 2.4);
      p.fill(r, g, b, theme.particleAlpha * 150);
      p.circle(CENTER.x, CENTER.y, pulse);

      for (const particle of particles) {
        const dx = CENTER.x - particle.x;
        const dy = CENTER.y - particle.y;
        const dist = Math.hypot(dx, dy) || 1;

        // Steady steering toward the centre keeps the inward flow tidy.
        particle.vx += (dx / dist) * 0.02;
        particle.vy += (dy / dist) * 0.02;
        particle.vx *= 0.96;
        particle.vy *= 0.96;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.age += 1;

        const fadeIn = p.constrain(particle.age / 12, 0, 1);
        const fadeCore = p.constrain(p.map(dist, 3, 10, 0, 1), 0, 1);
        p.fill(r, g, b, theme.particleAlpha * 235 * fadeIn * fadeCore);
        p.circle(particle.x, particle.y, particle.size);

        if (dist < 3.5) {
          Object.assign(particle, spawn(false));
        }
      }
    };
  };
}
