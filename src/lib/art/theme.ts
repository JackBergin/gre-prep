export interface ArtTheme {
  bg: string;
  accent: string;
  accentRgb: [number, number, number];
  ink: string;
  inkRgb: [number, number, number];
  artOpacity: number;
  particleAlpha: number;
  prismBeamAlpha: number;
  rayVerbal: string;
  rayQuant: string;
  rayWriting: string;
  rayVerbalRgb: [number, number, number];
  rayQuantRgb: [number, number, number];
  rayWritingRgb: [number, number, number];
}

function parseCssColor(color: string): [number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [91, 124, 250];
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

function readVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function readNumberVar(name: string, fallback: number): number {
  const raw = readVar(name, String(fallback));
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function readArtTheme(): ArtTheme {
  const accent = readVar("--accent", "#5B7CFA");
  const ink = readVar("--ink", "#41485A");
  const rayVerbal = readVar("--prism-ray-verbal", accent);
  const rayQuant = readVar("--prism-ray-quant", accent);
  const rayWriting = readVar("--prism-ray-writing", accent);

  return {
    bg: readVar("--bg", "#E0E5EC"),
    accent,
    accentRgb: parseCssColor(accent),
    ink,
    inkRgb: parseCssColor(ink),
    artOpacity: readNumberVar("--art-opacity", 0.55),
    particleAlpha: readNumberVar("--art-particle-alpha", 0.35),
    prismBeamAlpha: readNumberVar("--prism-beam-alpha", 0.45),
    rayVerbal,
    rayQuant,
    rayWriting,
    rayVerbalRgb: parseCssColor(rayVerbal),
    rayQuantRgb: parseCssColor(rayQuant),
    rayWritingRgb: parseCssColor(rayWriting),
  };
}
