import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface SectionSketchOptions {
  particleCount: number;
  speed: number;
}

interface Stroke {
  points: { x: number; y: number }[];
  phase: number;
}

export function createWritingSketch(options: SectionSketchOptions): (p: p5) => void {
  let strokes: Stroke[] = [];
  let theme = readArtTheme();

  return (p: p5) => {
    p.setup = () => {
      p.createCanvas(48, 48);
      initStrokes();
    };

    function initStrokes() {
      strokes = [];
      for (let i = 0; i < Math.max(3, Math.floor(options.particleCount / 4)); i++) {
        const points: { x: number; y: number }[] = [];
        let x = p.random(6, 14);
        let y = p.random(10, 38);
        const len = p.random(4, 8);
        for (let j = 0; j < len; j++) {
          points.push({ x, y });
          x += p.random(3, 7);
          y += p.random(-2, 2);
        }
        strokes.push({ points, phase: p.random(p.TWO_PI) });
      }
    }

    p.draw = () => {
      theme = readArtTheme();
      const [ar, ag, ab] = theme.accentRgb;
      p.background(p.color(theme.bg));

      const wobble = p.sin(p.frameCount * options.speed * 0.015) * 0.5;

      for (const stroke of strokes) {
        p.noFill();
        p.stroke(ar, ag, ab, theme.particleAlpha * 220);
        p.strokeWeight(1.2);
        for (let i = 0; i < stroke.points.length - 1; i++) {
          const a = stroke.points[i];
          const b = stroke.points[i + 1];
          const waveA = p.sin(stroke.phase + i * 0.8 + p.frameCount * 0.02) * wobble;
          const waveB = p.sin(stroke.phase + (i + 1) * 0.8 + p.frameCount * 0.02) * wobble;
          p.line(a.x, a.y + waveA, b.x, b.y + waveB);
        }
      }

      p.noStroke();
      p.fill(ar, ag, ab, theme.particleAlpha * 160);
      p.circle(38, 12, 2.5);
    };
  };
}
