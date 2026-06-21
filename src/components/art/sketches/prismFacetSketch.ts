import type p5 from "p5";
import type { Section } from "@/lib/types";
import { readArtTheme } from "@/lib/art/theme";

export interface PrismFacetOptions {
  section: Section;
  speed: number;
}

const SECTION_RAY_RGB = {
  verbal: "rayVerbalRgb",
  quantitative: "rayQuantRgb",
  writing: "rayWritingRgb",
} as const;

export function createPrismFacetSketch(options: PrismFacetOptions): (p: p5) => void {
  let theme = readArtTheme();

  return (p: p5) => {
    p.setup = () => {
      p.createCanvas(48, 48);
    };

    p.draw = () => {
      theme = readArtTheme();
      const rgbKey = SECTION_RAY_RGB[options.section];
      const [rr, rg, rb] = theme[rgbKey];
      p.background(p.color(theme.bg));

      const cx = 22;
      const cy = 26;
      const h = 22;
      const w = 16;

      const apex = { x: cx, y: cy - h * 0.45 };
      const bl = { x: cx - w * 0.5, y: cy + h * 0.42 };
      const br = { x: cx + w * 0.5, y: cy + h * 0.42 };

      const [ir, ig, ib] = theme.inkRgb;
      const pulse = 0.7 + p.sin(p.frameCount * options.speed * 0.04) * 0.2;

      p.fill(
        colorMix(ir, 255, 0.5),
        colorMix(ig, 255, 0.5),
        colorMix(ib, 255, 0.5),
        theme.prismBeamAlpha * 0.14 * 255
      );
      p.noStroke();
      p.triangle(apex.x, apex.y, bl.x, bl.y, br.x, br.y);

      p.stroke(ir, ig, ib, theme.prismBeamAlpha * 0.25 * 255);
      p.strokeWeight(0.6);
      p.noFill();
      p.triangle(apex.x, apex.y, bl.x, bl.y, br.x, br.y);

      const entryX = 4;
      const entryY = cy + p.sin(p.frameCount * 0.03) * 1.5;
      const hitX = bl.x + 2;
      const hitY = cy + 2;

      p.stroke(ir, ig, ib, theme.prismBeamAlpha * pulse * 0.5 * 255);
      p.strokeWeight(1.2);
      p.line(entryX, entryY, hitX, hitY);

      const exitX = br.x - 1;
      const exitY = cy - 1;
      const wobble = p.sin(p.frameCount * options.speed * 0.035) * 0.06;
      const angle = -0.15 + wobble;
      const len = 28;
      const endX = exitX + p.cos(angle) * len;
      const endY = exitY + p.sin(angle) * len;

      p.stroke(rr, rg, rb, theme.prismBeamAlpha * pulse * 0.25 * 255);
      p.strokeWeight(3);
      p.line(exitX, exitY, endX, endY);

      p.stroke(rr, rg, rb, theme.prismBeamAlpha * pulse * 255);
      p.strokeWeight(1);
      p.line(exitX, exitY, endX, endY);

      p.noStroke();
      p.fill(rr, rg, rb, theme.prismBeamAlpha * pulse * 0.5 * 255);
      p.circle(endX, endY, 2.5);
    };
  };
}

function colorMix(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}
