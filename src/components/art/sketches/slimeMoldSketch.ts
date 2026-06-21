import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface SlimeMoldOptions {
  agentCount: number;
  speed: number;
  sensorAngle: number;
  sensorDist: number;
  turnSpeed: number;
  trailDecay: number;
  getSize: () => { width: number; height: number };
}

interface Agent {
  x: number;
  y: number;
  heading: number;
}

export function createSlimeMoldSketch(
  options: SlimeMoldOptions
): (p: p5) => void {
  let agents: Agent[] = [];
  let theme = readArtTheme();
  let trail: Float32Array;
  let tw = 0;
  let th = 0;
  let d = 1;

  return (p: p5) => {
    p.setup = () => {
      const { width, height } = options.getSize();
      p.createCanvas(width, height);
      p.angleMode(p.DEGREES);
      d = p.pixelDensity();
      initScene();
    };

    function initScene() {
      theme = readArtTheme();
      tw = p.width;
      th = p.height;
      trail = new Float32Array(tw * th);

      const cx = tw * 0.5;
      const cy = th * 0.5;
      const spawnRadius = Math.min(tw, th) * 0.3;

      agents = [];
      for (let i = 0; i < options.agentCount; i++) {
        const angle = p.random(0, 360);
        const r = p.random(0, spawnRadius);
        agents.push({
          x: cx + p.cos(angle) * r,
          y: cy + p.sin(angle) * r,
          heading: p.random(0, 360),
        });
      }
    }

    p.draw = () => {
      theme = readArtTheme();
      const [vr, vg, vb] = theme.rayVerbalRgb;
      const [qr, qg, qb] = theme.rayQuantRgb;
      const [wr, wg, wb] = theme.rayWritingRgb;

      // Sense-rotate-move for each agent
      for (const agent of agents) {
        const fSense = sampleTrail(
          agent.x,
          agent.y,
          agent.heading,
          options.sensorDist
        );
        const lSense = sampleTrail(
          agent.x,
          agent.y,
          agent.heading - options.sensorAngle,
          options.sensorDist
        );
        const rSense = sampleTrail(
          agent.x,
          agent.y,
          agent.heading + options.sensorAngle,
          options.sensorDist
        );

        if (fSense > lSense && fSense > rSense) {
          // keep heading
        } else if (fSense < lSense && fSense < rSense) {
          agent.heading += p.random() < 0.5
            ? options.turnSpeed
            : -options.turnSpeed;
        } else if (lSense > rSense) {
          agent.heading -= options.turnSpeed;
        } else if (rSense > lSense) {
          agent.heading += options.turnSpeed;
        }

        agent.x =
          (agent.x + p.cos(agent.heading) * options.speed + tw) % tw;
        agent.y =
          (agent.y + p.sin(agent.heading) * options.speed + th) % th;

        // Deposit trail
        const tx = Math.floor(agent.x);
        const ty = Math.floor(agent.y);
        if (tx >= 0 && tx < tw && ty >= 0 && ty < th) {
          trail[ty * tw + tx] = Math.min(trail[ty * tw + tx] + 0.04, 1);
        }
      }

      // Diffuse & decay trail — tight cross kernel keeps lines thin
      const next = new Float32Array(tw * th);
      for (let y = 1; y < th - 1; y++) {
        for (let x = 1; x < tw - 1; x++) {
          const center = trail[y * tw + x];
          const sum =
            center * 4 +
            trail[(y - 1) * tw + x] +
            trail[(y + 1) * tw + x] +
            trail[y * tw + (x - 1)] +
            trail[y * tw + (x + 1)];
          next[y * tw + x] = (sum / 8) * options.trailDecay;
        }
      }
      trail = next;

      // Render to pixels
      p.loadPixels();
      const pw = d * tw;
      for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
          const v = trail[y * tw + x];
          if (v < 0.015) continue;

          // Color shifts across the canvas using 3 ray colors
          const t = x / tw;
          let cr: number, cg: number, cb: number;
          if (t < 0.5) {
            const mix = t * 2;
            cr = vr + (qr - vr) * mix;
            cg = vg + (qg - vg) * mix;
            cb = vb + (qb - vb) * mix;
          } else {
            const mix = (t - 0.5) * 2;
            cr = qr + (wr - qr) * mix;
            cg = qg + (wg - qg) * mix;
            cb = qb + (wb - qb) * mix;
          }

          const alpha = v * theme.particleAlpha * 255 * 2.5;

          for (let dy = 0; dy < d; dy++) {
            for (let dx = 0; dx < d; dx++) {
              const idx =
                4 * ((y * d + dy) * pw + (x * d + dx));
              // Alpha-blend over existing pixel
              const a = alpha / 255;
              p.pixels[idx] = p.pixels[idx] * (1 - a) + cr * a;
              p.pixels[idx + 1] = p.pixels[idx + 1] * (1 - a) + cg * a;
              p.pixels[idx + 2] = p.pixels[idx + 2] * (1 - a) + cb * a;
              p.pixels[idx + 3] = Math.min(
                255,
                p.pixels[idx + 3] + alpha
              );
            }
          }
        }
      }
      p.updatePixels();
    };

    function sampleTrail(
      x: number,
      y: number,
      angle: number,
      dist: number
    ): number {
      const sx = Math.floor((x + p.cos(angle) * dist + tw) % tw);
      const sy = Math.floor((y + p.sin(angle) * dist + th) % th);
      if (sx >= 0 && sx < tw && sy >= 0 && sy < th) {
        return trail[sy * tw + sx];
      }
      return 0;
    }

    p.windowResized = () => {
      const { width, height } = options.getSize();
      p.resizeCanvas(width, height);
      initScene();
    };
  };
}
