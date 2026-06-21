import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface HeroFieldOptions {
  particleCount: number;
  speed: number;
  connectionDist: number;
  parallaxStrength: number;
  interactive: boolean;
  getMouseNorm: () => { x: number; y: number };
  getSize: () => { width: number; height: number };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function createHeroFieldSketch(options: HeroFieldOptions): (p: p5) => void {
  let particles: Particle[] = [];
  let theme = readArtTheme();

  return (p: p5) => {
    p.setup = () => {
      const { width, height } = options.getSize();
      p.createCanvas(width, height);
      initParticles();
    };

    function initParticles() {
      particles = [];
      for (let i = 0; i < options.particleCount; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-1, 1) * options.speed,
          vy: p.random(-1, 1) * options.speed,
          size: p.random(1.5, 3.5),
        });
      }
    }

    p.draw = () => {
      theme = readArtTheme();
      const [ar, ag, ab] = theme.accentRgb;
      const bg = p.color(theme.bg);
      p.background(bg);

      const mouse = options.getMouseNorm();
      const offsetX = options.interactive ? (mouse.x - 0.5) * p.width * options.parallaxStrength : 0;
      const offsetY = options.interactive ? (mouse.y - 0.5) * p.height * options.parallaxStrength : 0;

      for (const pt of particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0) pt.x = p.width;
        if (pt.x > p.width) pt.x = 0;
        if (pt.y < 0) pt.y = p.height;
        if (pt.y > p.height) pt.y = 0;
      }

      const dist = options.connectionDist;
      p.noFill();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = p.dist(a.x, a.y, b.x, b.y);
          if (d < dist) {
            const alpha = p.map(d, 0, dist, theme.particleAlpha * 0.6, 0);
            p.stroke(ar, ag, ab, alpha * 255);
            p.strokeWeight(0.6);
            p.line(a.x + offsetX * 0.3, a.y + offsetY * 0.3, b.x + offsetX * 0.3, b.y + offsetY * 0.3);
          }
        }
      }

      p.noStroke();
      for (const pt of particles) {
        p.fill(ar, ag, ab, theme.particleAlpha * 255);
        p.circle(pt.x + offsetX, pt.y + offsetY, pt.size);
      }
    };

    p.windowResized = () => {
      const { width, height } = options.getSize();
      p.resizeCanvas(width, height);
      initParticles();
    };
  };
}
