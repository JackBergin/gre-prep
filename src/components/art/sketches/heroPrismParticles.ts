import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface HeroPrismParticleOptions {
  particleCount: number;
  speed: number;
  connectionDist: number;
  parallaxStrength: number;
  interactive: boolean;
  getMouseNorm: () => { x: number; y: number };
  getSize: () => { width: number; height: number };
}

type ParticleRole = "vertex" | "edge" | "interior";

interface Particle {
  waveX: number;
  waveY: number;
  prismX: number;
  prismY: number;
  size: number;
  hueOffset: number;
  role: ParticleRole;
  edgeIndex: number;
  edgeT: number;
  settleDelay: number;
}

interface PrismShape {
  apex: { x: number; y: number };
  bl: { x: number; y: number };
  br: { x: number; y: number };
}

const CYCLE_FRAMES = 480;
const EDGES: [keyof PrismShape, keyof PrismShape][] = [
  ["apex", "br"],
  ["br", "bl"],
  ["bl", "apex"],
];

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
      particles = buildParticles(p, options.particleCount, prism);
    }

    p.draw = () => {
      theme = readArtTheme();
      // Transparent canvas so the field composites over the glass panel rather
      // than painting an opaque page-coloured rectangle behind the headline.
      p.clear();

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

      const positions: { x: number; y: number; morph: number }[] = [];

      for (const pt of particles) {
        const particleMorph = particleMorphAmount(morph, pt.settleDelay);
        const waveDrift = p.sin(p.frameCount * 0.018 + pt.hueOffset * p.TWO_PI) * 6;
        // Travelling vertical undulation that lives while in the wave state and
        // settles to zero as the field consolidates into the prism (1 - morph).
        const waveBob =
          p.sin(p.frameCount * 0.022 + pt.waveX * 0.035) * 12 * (1 - particleMorph);
        const wx = pt.waveX + waveDrift + parallaxX * (0.35 + pt.hueOffset * 0.25);
        const wy = pt.waveY + waveBob + parallaxY * 0.4;

        const settlePulse =
          pt.role === "interior"
            ? p.sin(p.frameCount * 0.014 + pt.hueOffset * p.TWO_PI) * 2 * particleMorph
            : p.sin(p.frameCount * 0.02 + pt.edgeT * p.TWO_PI) * 1.5 * particleMorph;

        const px = pt.prismX + parallaxX * 0.15 + settlePulse * 0.35;
        const py = pt.prismY + parallaxY * 0.15 + attract * 8 + settlePulse * 0.35;

        const x = p.lerp(wx, px, particleMorph);
        const y = p.lerp(wy, py, particleMorph);

        positions.push({ x, y, morph: particleMorph });

        const rayMix = pt.hueOffset;
        const rr = lerp3(vr, qr, wr, rayMix);
        const rg = lerp3(vg, qg, wg, rayMix);
        const rb = lerp3(vb, qb, wb, rayMix);

        const roleAlpha =
          pt.role === "vertex" ? 1 : pt.role === "edge" ? 0.92 : 0.62;
        const alpha =
          theme.particleAlpha * p.lerp(0.55, roleAlpha, particleMorph) * 255;

        const roleSize =
          pt.role === "vertex" ? 1.35 : pt.role === "edge" ? 1.2 : 0.95;
        const radius = pt.size * p.lerp(1, roleSize, particleMorph);

        p.noStroke();
        p.fill(rr, rg, rb, alpha);
        p.circle(x, y, radius);
      }

      if (morph > 0.62) {
        drawEdgeConnections(
          p,
          particles,
          positions,
          morph,
          options.connectionDist,
          theme.particleAlpha,
          ir,
          ig,
          ib
        );
      }
    };

    p.windowResized = () => {
      const { width, height } = options.getSize();
      p.resizeCanvas(width, height);
      initScene();
    };
  };
}

function buildParticles(p: p5, count: number, prism: PrismShape): Particle[] {
  const particles: Particle[] = [];
  const vertexCount = Math.min(3, count);
  const edgeCount = Math.max(0, Math.round((count - vertexCount) * 0.42));
  const interiorCount = Math.max(0, count - vertexCount - edgeCount);

  const vertices: (keyof PrismShape)[] = ["apex", "bl", "br"];
  for (let i = 0; i < vertexCount; i++) {
    const key = vertices[i % 3];
    const wave = wavePoint(i / Math.max(count - 1, 1), p.width, p.height);
    const target = prism[key];
    particles.push({
      waveX: wave.x,
      waveY: wave.y,
      prismX: target.x,
      prismY: target.y,
      size: p.random(2.4, 3.4),
      hueOffset: p.random(0, 1),
      role: "vertex",
      edgeIndex: i % 3,
      edgeT: 0,
      settleDelay: p.random(0, 0.08),
    });
  }

  for (let i = 0; i < edgeCount; i++) {
    const t = (i + 0.5) / edgeCount;
    const wave = wavePoint((vertexCount + i) / Math.max(count - 1, 1), p.width, p.height);
    const edgeIndex = Math.floor(t * 3) % 3;
    const edgeT = (t * 3) % 1;
    const target = prismEdgePoint(edgeIndex, edgeT, prism);

    particles.push({
      waveX: wave.x,
      waveY: wave.y,
      prismX: target.x,
      prismY: target.y,
      size: p.random(1.6, 2.8),
      hueOffset: p.random(0, 1),
      role: "edge",
      edgeIndex,
      edgeT,
      settleDelay: p.random(0.04, 0.22),
    });
  }

  for (let i = 0; i < interiorCount; i++) {
    const t = (vertexCount + edgeCount + i) / Math.max(count - 1, 1);
    const wave = wavePoint(t, p.width, p.height);
    const target = randomInTriangle(prism, () => p.random());

    particles.push({
      waveX: wave.x,
      waveY: wave.y,
      prismX: target.x,
      prismY: target.y,
      size: p.random(1.2, 2.4),
      hueOffset: p.random(0, 1),
      role: "interior",
      edgeIndex: -1,
      edgeT: 0,
      settleDelay: p.random(0.12, 0.38),
    });
  }

  return particles;
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

function prismEdgePoint(
  edgeIndex: number,
  edgeT: number,
  prism: PrismShape
): { x: number; y: number } {
  const [fromKey, toKey] = EDGES[edgeIndex % 3];
  return lerpPoint(prism[fromKey], prism[toKey], edgeT);
}

function randomInTriangle(
  prism: PrismShape,
  random: () => number
): { x: number; y: number } {
  let u = random();
  let v = random();
  if (u + v > 1) {
    u = 1 - u;
    v = 1 - v;
  }
  const w = 1 - u - v;
  return {
    x: w * prism.apex.x + u * prism.br.x + v * prism.bl.x,
    y: w * prism.apex.y + u * prism.br.y + v * prism.bl.y,
  };
}

function morphAmount(phase: number): number {
  if (phase < 0.28) return easeInOut(phase / 0.28) * 0.08;
  if (phase < 0.48) return easeInOut((phase - 0.28) / 0.2);
  if (phase < 0.68) return 1;
  if (phase < 0.88) return 1 - easeInOut((phase - 0.68) / 0.2);
  return (1 - easeInOut((phase - 0.88) / 0.12)) * 0.08;
}

function particleMorphAmount(globalMorph: number, settleDelay: number): number {
  const window = 0.82;
  const t = (globalMorph - settleDelay) / window;
  return easeInOut(Math.max(0, Math.min(1, t)));
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

function drawEdgeConnections(
  p: p5,
  particles: Particle[],
  positions: { x: number; y: number; morph: number }[],
  morph: number,
  connectionDist: number,
  particleAlpha: number,
  ir: number,
  ig: number,
  ib: number
): void {
  const edgeStrength = easeInOut((morph - 0.62) / 0.28);
  if (edgeStrength <= 0) return;

  for (let edge = 0; edge < 3; edge++) {
    const indices: number[] = [];
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].role === "edge" && particles[i].edgeIndex === edge) {
        indices.push(i);
      }
    }
    indices.sort((a, b) => particles[a].edgeT - particles[b].edgeT);

    for (let i = 0; i < indices.length - 1; i++) {
      const a = positions[indices[i]];
      const b = positions[indices[i + 1]];
      const avgMorph = (a.morph + b.morph) * 0.5;
      const d = p.dist(a.x, a.y, b.x, b.y);
      const maxDist = Math.min(connectionDist * 0.55, d * 1.35);
      if (d > maxDist) continue;

      const alpha =
        particleAlpha * edgeStrength * avgMorph * p.map(d, 0, maxDist, 0.42, 0.08) * 255;
      p.noFill();
      p.stroke(ir, ig, ib, alpha);
      p.strokeWeight(0.9);
      p.line(a.x, a.y, b.x, b.y);
    }

    if (indices.length > 0) {
      const vertexIdx = particles.findIndex(
        (pt) => pt.role === "vertex" && pt.edgeIndex === edge
      );
      if (vertexIdx >= 0) {
        const v = positions[vertexIdx];
        const first = positions[indices[0]];
        const last = positions[indices[indices.length - 1]];
        for (const neighbor of [first, last]) {
          const avgMorph = (v.morph + neighbor.morph) * 0.5;
          const d = p.dist(v.x, v.y, neighbor.x, neighbor.y);
          const maxDist = connectionDist * 0.65;
          if (d > maxDist) continue;
          const alpha =
            particleAlpha * edgeStrength * avgMorph * p.map(d, 0, maxDist, 0.35, 0.06) * 255;
          p.noFill();
          p.stroke(ir, ig, ib, alpha);
          p.strokeWeight(0.85);
          p.line(v.x, v.y, neighbor.x, neighbor.y);
        }
      }
    }
  }
}
