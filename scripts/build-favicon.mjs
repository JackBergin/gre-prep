import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const SVG = readFileSync(new URL("../src/app/icon.svg", import.meta.url), "utf8");
const ICO_SIZES = [16, 32, 48];
const ALL = [...ICO_SIZES, 128]; // 128 = preview only

const browser = await chromium.launch();
const pngs = {};
for (const s of ALL) {
  const page = await browser.newPage({ viewport: { width: s, height: s }, deviceScaleFactor: 1 });
  // Transparent background so only the rounded badge shows.
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">
       <div style="width:${s}px;height:${s}px">${SVG.replace("<svg ", `<svg width="${s}" height="${s}" `)}</div>
     </body></html>`,
    { waitUntil: "networkidle" }
  );
  pngs[s] = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: s, height: s } });
  await page.close();
}
await browser.close();

// Preview for inspection.
writeFileSync("/tmp/shots/icon-preview.png", pngs[128]);
writeFileSync("/tmp/shots/icon-32.png", pngs[32]);

// Pack PNG-in-ICO (Vista+). Each directory entry points at raw PNG bytes.
const entries = ICO_SIZES.map((s) => ({ s, data: pngs[s] }));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(entries.length, 4);

const dir = Buffer.alloc(16 * entries.length);
let offset = 6 + dir.length;
entries.forEach((e, i) => {
  const o = i * 16;
  dir.writeUInt8(e.s >= 256 ? 0 : e.s, o + 0); // width
  dir.writeUInt8(e.s >= 256 ? 0 : e.s, o + 1); // height
  dir.writeUInt8(0, o + 2); // palette
  dir.writeUInt8(0, o + 3); // reserved
  dir.writeUInt16LE(1, o + 4); // color planes
  dir.writeUInt16LE(32, o + 6); // bits per pixel
  dir.writeUInt32LE(e.data.length, o + 8); // size of PNG
  dir.writeUInt32LE(offset, o + 12); // offset
  offset += e.data.length;
});

const ico = Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
writeFileSync(new URL("../src/app/favicon.ico", import.meta.url), ico);
console.log("favicon.ico written:", ico.length, "bytes; sizes:", ICO_SIZES.join(","));
