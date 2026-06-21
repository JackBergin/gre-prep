import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";
import type { SectionSketchOptions } from "./types";

const WAVE_COUNT = 3;
const WAVE_TOP = 13;
const WAVE_GAP = 11;
const AMPLITUDE = 2.6;
const FREQUENCY = 0.26;

export function createWritingSketch(options: SectionSketchOptions): (p: p5) => void {
  let theme = readArtTheme();
  let phase = 0;

  return (p: p5) => {
    p.setup = () => {
      p.createCanvas(48, 48);
    };

    p.draw = () => {
      theme = readArtTheme();
      const [r, g, b] = theme.accentRgb;
      p.background(p.color(theme.bg));

      phase += options.speed * 0.18;

      const left = 5;
      const right = 43;

      p.noFill();
      p.strokeWeight(1.4);
      p.strokeJoin(p.ROUND);
      p.strokeCap(p.ROUND);

      for (let wave = 0; wave < WAVE_COUNT; wave++) {
        const baseY = WAVE_TOP + wave * WAVE_GAP;
        // A small per-wave phase offset gives a gentle travelling cadence.
        const wavePhase = phase - wave * 0.9;
        p.stroke(r, g, b, theme.particleAlpha * 235);
        p.beginShape();
        for (let x = left; x <= right; x += 1) {
          const y = baseY + p.sin(x * FREQUENCY + wavePhase) * AMPLITUDE;
          p.vertex(x, y);
        }
        p.endShape();
      }
    };
  };
}
