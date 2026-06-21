import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const lightSvg = readFileSync(new URL("public/icon-light.svg", root), "utf8");
const darkSvg = readFileSync(new URL("public/icon-dark.svg", root), "utf8");
const ICO_SIZES = [16, 32, 48];
const PNG_SIZES = [32, 180];

async function renderSvg(svg, size) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });

  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">
       <div style="width:${size}px;height:${size}px">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</div>
     </body></html>`,
    { waitUntil: "networkidle" }
  );

  const png = await page.screenshot({
    omitBackground: true,
    clip: { x: 0, y: 0, width: size, height: size },
  });

  await browser.close();
  return png;
}

function packIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;

  entries.forEach((entry, index) => {
    const base = index * 16;
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, base);
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, base + 1);
    dir.writeUInt8(0, base + 2);
    dir.writeUInt8(0, base + 3);
    dir.writeUInt16LE(1, base + 4);
    dir.writeUInt16LE(32, base + 6);
    dir.writeUInt32LE(entry.data.length, base + 8);
    dir.writeUInt32LE(offset, base + 12);
    offset += entry.data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((entry) => entry.data)]);
}

const lightPngs = {};
for (const size of [...ICO_SIZES, ...PNG_SIZES]) {
  lightPngs[size] = await renderSvg(lightSvg, size);
}

const darkPngs = {};
for (const size of PNG_SIZES) {
  darkPngs[size] = await renderSvg(darkSvg, size);
}

writeFileSync(
  new URL("src/app/favicon.ico", root),
  packIco(ICO_SIZES.map((size) => ({ size, data: lightPngs[size] })))
);
writeFileSync(new URL("public/icon-light.png", root), lightPngs[32]);
writeFileSync(new URL("public/icon-dark.png", root), darkPngs[32]);
writeFileSync(new URL("public/apple-icon-light.png", root), lightPngs[180]);
writeFileSync(new URL("public/apple-icon-dark.png", root), darkPngs[180]);

console.log("Generated favicon.ico, icon-light.png, icon-dark.png, apple-icon-light.png, apple-icon-dark.png");
