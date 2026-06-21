import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";
import type { SectionSketchOptions } from "./types";

export type { SectionSketchOptions };

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function createQuantSketch(options: SectionSketchOptions): (p: p5) => void {
  let nodes: Node[] = [];
  let theme = readArtTheme();

  return (p: p5) => {
    p.setup = () => {
      p.createCanvas(48, 48);
      initNodes();
    };

    function initNodes() {
      nodes = [];
      for (let i = 0; i < options.particleCount; i++) {
        nodes.push({
          x: p.random(6, 42),
          y: p.random(6, 42),
          vx: p.random(-1, 1) * options.speed,
          vy: p.random(-1, 1) * options.speed,
        });
      }
    }

    p.draw = () => {
      theme = readArtTheme();
      const [ar, ag, ab] = theme.accentRgb;
      p.background(p.color(theme.bg));

      p.stroke(ar, ag, ab, theme.particleAlpha * 80);
      p.strokeWeight(0.5);
      const gridStep = 12;
      for (let x = gridStep; x < 48; x += gridStep) {
        p.line(x, 4, x, 44);
      }
      for (let y = gridStep; y < 48; y += gridStep) {
        p.line(4, y, 44, y);
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 4 || n.x > 44) n.vx *= -1;
        if (n.y < 4 || n.y > 44) n.vy *= -1;
      }

      p.noFill();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = p.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          if (d < 22) {
            p.stroke(ar, ag, ab, p.map(d, 0, 22, theme.particleAlpha * 180, 0));
            p.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          }
        }
      }

      p.noStroke();
      p.fill(ar, ag, ab, theme.particleAlpha * 255);
      for (const n of nodes) {
        p.rectMode(p.CENTER);
        p.square(n.x, n.y, 3, 1);
      }
    };
  };
}
