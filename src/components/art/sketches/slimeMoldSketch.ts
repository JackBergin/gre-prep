import type p5 from "p5";
import { readArtTheme } from "@/lib/art/theme";

export interface SlimeMoldOptions {
  agentCount: number;
  speed: number;
  getSize: () => { width: number; height: number };
}

interface Agent {
  x: number;
  y: number;
  heading: number;
  sensorAngle: number;
  sensorDist: number;
  rotAngle: number;
}

function parseBg(bg: string): [number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [224, 229, 236];
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

export function createSlimeMoldSketch(
  options: SlimeMoldOptions
): (p: p5) => void {
  let agents: Agent[] = [];
  let theme = readArtTheme();
  let d = 1;
  let bgRgb: [number, number, number] = [224, 229, 236];

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
      bgRgb = parseBg(theme.bg);
      p.background(bgRgb[0], bgRgb[1], bgRgb[2]);

      const cx = p.width * 0.5;
      const cy = p.height * 0.5;

      agents = [];
      for (let i = 0; i < options.agentCount; i++) {
        agents.push({
          x: p.random(cx - 20, cx + 20),
          y: p.random(cy - 20, cy + 20),
          heading: p.random(360),
          sensorAngle: 45,
          sensorDist: 10,
          rotAngle: 45,
        });
      }
    }

    p.draw = () => {
      theme = readArtTheme();
      bgRgb = parseBg(theme.bg);
      const [br, bg, bb] = bgRgb;
      const [vr, vg, vb] = theme.rayVerbalRgb;
      const [qr, qg, qb] = theme.rayQuantRgb;
      const [wr, wg, wb] = theme.rayWritingRgb;

      // Fading background — produces thin persistent trails.
      // A lower alpha means deposits clear more slowly, so the trail
      // network accumulates and becomes visible much sooner.
      p.background(br, bg, bb, 7);
      p.loadPixels();

      const pw = d * p.width;

      for (const agent of agents) {
        // Move
        agent.x = (agent.x + p.cos(agent.heading) * options.speed + p.width) % p.width;
        agent.y = (agent.y + p.sin(agent.heading) * options.speed + p.height) % p.height;

        // Sense pixel brightness in 3 directions
        const f = senseAt(agent.x, agent.y, agent.heading, agent.sensorDist, pw);
        const l = senseAt(agent.x, agent.y, agent.heading - agent.sensorAngle, agent.sensorDist, pw);
        const r = senseAt(agent.x, agent.y, agent.heading + agent.sensorAngle, agent.sensorDist, pw);

        // Steer toward brighter trails
        if (f > l && f > r) {
          // keep heading
        } else if (f < l && f < r) {
          agent.heading += p.random() < 0.5 ? agent.rotAngle : -agent.rotAngle;
        } else if (l > r) {
          agent.heading -= agent.rotAngle;
        } else if (r > l) {
          agent.heading += agent.rotAngle;
        }

        // Color based on horizontal position — verbal → quant → writing
        const t = agent.x / p.width;
        let cr: number, cg: number, cb: number;
        if (t < 0.5) {
          const m = t * 2;
          cr = vr + (qr - vr) * m;
          cg = vg + (qg - vg) * m;
          cb = vb + (qb - vb) * m;
        } else {
          const m = (t - 0.5) * 2;
          cr = qr + (wr - qr) * m;
          cg = qg + (wg - qg) * m;
          cb = qb + (wb - qb) * m;
        }

        p.noStroke();
        p.fill(cr, cg, cb, theme.particleAlpha * 255);
        p.ellipse(agent.x, agent.y, 1, 1);
      }
    };

    function senseAt(
      x: number,
      y: number,
      angle: number,
      dist: number,
      pw: number
    ): number {
      const sx = Math.floor((x + p.cos(angle) * dist + p.width) % p.width);
      const sy = Math.floor((y + p.sin(angle) * dist + p.height) % p.height);
      const idx = 4 * (d * sy) * pw + 4 * (d * sx);
      // Measure color distance from background — agents follow trails
      const dr = (p.pixels[idx] ?? bgRgb[0]) - bgRgb[0];
      const dg = (p.pixels[idx + 1] ?? bgRgb[1]) - bgRgb[1];
      const db = (p.pixels[idx + 2] ?? bgRgb[2]) - bgRgb[2];
      return Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    }

    p.windowResized = () => {
      const { width, height } = options.getSize();
      p.resizeCanvas(width, height);
      initScene();
    };
  };
}
