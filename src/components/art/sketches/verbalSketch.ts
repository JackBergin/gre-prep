import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface SectionSketchOptions {
  particleCount: number;
  speed: number;
}

interface Glyph {
  x: number;
  y: number;
  char: string;
  phase: number;
}

const GLYPHS = "αβγδεζηθικλμνξοπρστυφχψωABCDEF";

export function createVerbalSketch(options: SectionSketchOptions): (p: p5) => void {
  let glyphs: Glyph[] = [];
  let theme = readArtTheme();

  return (p: p5) => {
    p.setup = () => {
      p.createCanvas(48, 48);
      initGlyphs();
    };

    function initGlyphs() {
      glyphs = [];
      for (let i = 0; i < options.particleCount; i++) {
        glyphs.push({
          x: p.random(8, 40),
          y: p.random(8, 40),
          char: GLYPHS[Math.floor(p.random(GLYPHS.length))],
          phase: p.random(p.TWO_PI),
        });
      }
    }

    p.draw = () => {
      theme = readArtTheme();
      const [ar, ag, ab] = theme.accentRgb;
      p.background(p.color(theme.bg));

      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      for (const g of glyphs) {
        const drift = p.sin(p.frameCount * options.speed * 0.02 + g.phase) * 2;
        p.fill(ar, ag, ab, theme.particleAlpha * 200);
        p.noStroke();
        p.text(g.char, g.x + drift, g.y);
      }
    };
  };
}
