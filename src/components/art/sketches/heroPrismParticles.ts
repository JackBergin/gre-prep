import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface HeroPrismParticleOptions {
  particleCount: number;
  speed: number;
  parallaxStrength: number;
  interactive: boolean;
  getMouseNorm: () => { x: number; y: number };
  getSize: () => { width: number; height: number };
}

interface Particle {
  waveX: number;
  waveY: number;
  prismX: number;
  prismY: number;
  size: number;
  hueOffset: number;
}

interface PrismShape {
  apex: { x: number; y: number };
  bl: { x: number; y: number };
  br: { x: number; y: number };
}

const CYCLE_FRAMES = 480;

export function createHeroPrismParticlesSketch(
  options: HeroPrismParticleOptions
): (p: p5) => void {
  let particles: Particle[] = [];
  let theme = readArtTheme();
  let prism: PrismShape = { apex: { x: 0, y: 0 }, bl: { x: 0, y: 0 }, br: { x: 0, y: 0 } };

  return (p: p5) => {
    p.setup = () => {
      const { width, height } = options.getSize();
      p.createCanvas(width, height);
      initScene();
    };

    function initScene() {
      theme = readArtTheme();
      prism = computePrism(p.width, p.height);
      particles = [];

      for (let i = 0; i < options.particleCount; i++) {
        const t = i / Math.max(options.particleCount - 1, 1);
        const wave = wavePoint(t, p.width, p.height);
        const edge = prismEdgePoint(t, prism);

        particles.push({
          waveX: wave.x,
          waveY: wave.y,
          prismX: edge.x,
          prismY: edge.y,
          size: p.random(1.4, 3.2),
          hueOffset: p.random(0, 1),
        });
      }
    }

    p.draw = () => {
      theme = readArtTheme();
      p.background(p.color(theme.bg));

      const mouse = options.getMouseNorm();
      const parallaxX = options.interactive
        ? (mouse.x - 0.5) * p.width * options.parallaxStrength
        : 0;
      const parallaxY = options.interactive
        ? (mouse.y - 0.5) * p.height * options.parallaxStrength * 0.6
        : 0;

      const cycle = (p.frameCount * options.speed) % CYCLE_FRAMES;
      const phase = cycle / CYCLE_FRAMES;
      const morph = morphAmount(phase);
      const attract = options.interactive ? 0.12 + (mouse.y - 0.5) * 0.08 : 0;

      const [ir, ig, ib] = theme.inkRgb;
      const [vr, vg, vb] = theme.rayVerbalRgb;
      const [qr, qg, qb] = theme.rayQuantRgb;
      const [wr, wg, wb] = theme.rayWritingRgb;

      if (morph > 0.55) {
        drawPrismGlow(p, prism, morph, theme.prismBeamAlpha, ir, ig, ib);
      }

      for (const pt of particles) {
        const waveDrift = p.sin(p.frameCount * 0.018 + pt.hueOffset * p.TWO_PI) * 6;
        const wx = pt.waveX + waveDrift + parallaxX * (0.35 + pt.hueOffset * 0.25);
        const wy = pt.waveY + parallaxY * 0.4;

        const px = pt.prismX + parallaxX * 0.15;
        const py = pt.prismY + parallaxY * 0.15 + attract * 8;

        const x = p.lerp(wx, px, morph);
        const y = p.lerp(wy, py, morph);

        const rayMix = pt.hueOffset;
        const rr = lerp3(vr, qr, wr, rayMix);
        const rg = lerp3(vg, qg, wg, rayMix);
        const rb = lerp3(vb, qb, wb, rayMix);

        const alpha =
          theme.particleAlpha * p.lerp(0.55, 0.95, morph) * 255;

        p.noStroke();
        p.fill(rr, rg, rb, alpha);
        p.circle(x, y, pt.size * p.lerp(1, 1.15, morph));
      }

      if (morph > 0.45) {
        drawPrismOutline(p, prism, morph, theme.prismBeamAlpha, ir, ig, ib);
      }
    };

    p.windowResized = () => {
      const { width, height } = options.getSize();
      p.resizeCanvas(width, height);
      initScene();
    };
  };
}

function computePrism(width: number, height: number): PrismShape {
  const cx = width * 0.5;
  const cy = height * 0.52;
  const prismH = Math.min(width, height) * 0.72;
  const prismW = prismH * 0.78;

  return {
    apex: { x: cx, y: cy - prismH * 0.46 },
    bl: { x: cx - prismW * 0.5, y: cy + prismH * 0.42 },
    br: { x: cx + prismW * 0.5, y: cy + prismH * 0.42 },
  };
}

function wavePoint(t: number, width: number, height: number): { x: number; y: number } {
  const x = width * 0.08 + t * width * 0.84;
  const midY = height * 0.5;
  const amp = height * 0.22;
  const y = midY + Math.sin(t * Math.PI * 3.2) * amp;
  return { x, y };
}

function prismEdgePoint(t: number, prism: PrismShape): { x: number; y: number } {
  const perimeter = 1;
  const u = t * perimeter;

  if (u < 0.34) {
    return lerpPoint(prism.apex, prism.br, u / 0.34);
  }
  if (u < 0.67) {
    return lerpPoint(prism.br, prism.bl, (u - 0.34) / 0.33);
  }
  return lerpPoint(prism.bl, prism.apex, (u - 0.67) / 0.33);
}

function morphAmount(phase: number): number {
  if (phase < 0.28) return easeInOut(phase / 0.28) * 0.08;
  if (phase < 0.48) return easeInOut((phase - 0.28) / 0.2);
  if (phase < 0.68) return 1;
  if (phase < 0.88) return 1 - easeInOut((phase - 0.68) / 0.2);
  return (1 - easeInOut((phase - 0.88) / 0.12)) * 0.08;
}

function easeInOut(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 2 * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
}

function lerpPoint(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number
): { x: number; y: number } {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function lerp3(a: number, b: number, c: number, t: number): number {
  if (t < 0.5) return a + (b - a) * (t * 2);
  return b + (c - b) * ((t - 0.5) * 2);
}

function drawPrismGlow(
  p: p5,
  prism: PrismShape,
  morph: number,
  beamAlpha: number,
  ir: number,
  ig: number,
  ib: number
): void {
  const fillAlpha = beamAlpha * (morph - 0.45) * 0.18 * 255;
  p.noStroke();
  p.fill(ir, ig, ib, fillAlpha);
  p.triangle(prism.apex.x, prism.apex.y, prism.bl.x, prism.bl.y, prism.br.x, prism.br.y);
}

function drawPrismOutline(
  p: p5,
  prism: PrismShape,
  morph: number,
  beamAlpha: number,
  ir: number,
  ig: number,
  ib: number
): void {
  const strokeAlpha = beamAlpha * (morph - 0.35) * 0.35 * 255;
  p.noFill();
  p.stroke(ir, ig, ib, strokeAlpha);
  p.strokeWeight(1.2);
  p.triangle(prism.apex.x, prism.apex.y, prism.bl.x, prism.bl.y, prism.br.x, prism.br.y);
}
