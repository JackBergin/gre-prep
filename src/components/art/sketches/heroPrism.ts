import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface HeroPrismOptions {
  interactive: boolean;
  getMouseNorm: () => { x: number; y: number };
  getSize: () => { width: number; height: number };
}

interface Ray {
  angle: number;
  rgb: [number, number, number];
  phase: number;
}

export function createHeroPrismSketch(options: HeroPrismOptions): (p: p5) => void {
  let theme = readArtTheme();
  let rays: Ray[] = [];

  return (p: p5) => {
    p.setup = () => {
      const { width, height } = options.getSize();
      p.createCanvas(width, height);
      initRays();
    };

    function initRays() {
      theme = readArtTheme();
      rays = [
        { angle: -0.42, rgb: theme.rayVerbalRgb, phase: 0 },
        { angle: 0.08, rgb: theme.rayQuantRgb, phase: p.TWO_PI / 3 },
        { angle: 0.52, rgb: theme.rayWritingRgb, phase: (p.TWO_PI * 2) / 3 },
      ];
    }

    p.draw = () => {
      theme = readArtTheme();
      const bg = p.color(theme.bg);
      p.background(bg);

      const mouse = options.getMouseNorm();
      const parallaxX = options.interactive ? (mouse.x - 0.5) * 28 : 0;
      const parallaxY = options.interactive ? (mouse.y - 0.5) * 18 : 0;

      const cx = p.width * 0.56 + parallaxX * 0.35;
      const cy = p.height * 0.5 + parallaxY * 0.25;
      const prismH = Math.min(p.width, p.height) * 0.28;
      const prismW = prismH * 0.72;

      const apex = { x: cx, y: cy - prismH * 0.52 };
      const bl = { x: cx - prismW * 0.5, y: cy + prismH * 0.48 };
      const br = { x: cx + prismW * 0.5, y: cy + prismH * 0.48 };

      const entryY = cy + p.sin(p.frameCount * 0.018) * 4;
      const entryX = p.width * 0.08 + parallaxX;
      const hitX = bl.x + (br.x - bl.x) * 0.38;
      const hitY = bl.y + (apex.y - bl.y) * 0.55 + p.sin(p.frameCount * 0.022 + 1) * 2;

      const beamPulse = 0.72 + p.sin(p.frameCount * 0.03) * 0.12;
      const [ir, ig, ib] = theme.inkRgb;
      const beamAlpha = theme.prismBeamAlpha * beamPulse * 255;

      p.noFill();
      p.stroke(ir, ig, ib, beamAlpha * 0.35);
      p.strokeWeight(Math.max(p.width * 0.012, 6));
      p.line(entryX, entryY, hitX, hitY);

      p.stroke(ir, ig, ib, beamAlpha * 0.55);
      p.strokeWeight(Math.max(p.width * 0.004, 2));
      p.line(entryX, entryY, hitX, hitY);

      p.fill(
        colorMix(ir, 255, 0.55),
        colorMix(ig, 255, 0.55),
        colorMix(ib, 255, 0.55),
        theme.prismBeamAlpha * 0.12 * 255
      );
      p.noStroke();
      p.triangle(apex.x, apex.y, bl.x, bl.y, br.x, br.y);

      p.stroke(ir, ig, ib, theme.prismBeamAlpha * 0.22 * 255);
      p.strokeWeight(1);
      p.noFill();
      p.triangle(apex.x, apex.y, bl.x, bl.y, br.x, br.y);

      const exitX = br.x + (apex.x - bl.x) * 0.12;
      const exitY = bl.y + (apex.y - bl.y) * 0.35;
      const rayLen = Math.min(p.width, p.height) * 0.55;

      for (const ray of rays) {
        const [rr, rg, rb] = ray.rgb;
        const wobble = p.sin(p.frameCount * 0.025 + ray.phase) * 0.04;
        const angle = ray.angle + wobble;
        const endX = exitX + p.cos(angle) * rayLen;
        const endY = exitY + p.sin(angle) * rayLen;
        const alpha = theme.prismBeamAlpha * (0.65 + p.sin(p.frameCount * 0.028 + ray.phase) * 0.15);

        p.noFill();
        p.stroke(rr, rg, rb, alpha * 0.18 * 255);
        p.strokeWeight(Math.max(p.width * 0.009, 5));
        p.line(exitX, exitY, endX, endY);

        p.stroke(rr, rg, rb, alpha * 255);
        p.strokeWeight(Math.max(p.width * 0.003, 1.5));
        p.line(exitX, exitY, endX, endY);

        p.noStroke();
        p.fill(rr, rg, rb, alpha * 0.35 * 255);
        p.circle(endX, endY, 5);
      }
    };

    p.windowResized = () => {
      const { width, height } = options.getSize();
      p.resizeCanvas(width, height);
      initRays();
    };
  };
}

function colorMix(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}
