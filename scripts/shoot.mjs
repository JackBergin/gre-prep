import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.SHOOT_URL || "http://localhost:3000/";
const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 3,
  reducedMotion: "no-preference",
});
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const logo = page.locator("svg.logo").first();
const box = await logo.boundingBox();
const pad = 8;
const clip = {
  x: box.x - pad,
  y: box.y - pad,
  width: box.width + pad * 2,
  height: box.height + pad * 2,
};

// Freeze every logo animation at an exact phase of the 5s loop and snap it.
const phases = [0, 0.1, 0.2, 0.35, 0.45, 0.5, 0.55, 0.62, 0.7, 0.78, 0.86, 0.92];
for (let i = 0; i < phases.length; i++) {
  const pct = phases[i];
  await page.evaluate((ms) => {
    document.getAnimations().forEach((a) => {
      const name = a.animationName || "";
      if (name.startsWith("pp-spoke-")) {
        a.pause();
        a.currentTime = ms;
      }
    });
  }, pct * 5000);
  await page.waitForTimeout(80);
  await page.screenshot({
    path: `${OUT}/logo-${String(Math.round(pct * 100)).padStart(3, "0")}.png`,
    clip,
  });
}

await browser.close();
console.log("done", box);
