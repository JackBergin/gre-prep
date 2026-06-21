import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const OUT="/tmp/shots"; mkdirSync(OUT,{recursive:true});
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900}, deviceScaleFactor:2, reducedMotion:"no-preference" });
await p.goto("http://localhost:3000/", { waitUntil:"networkidle" });
await p.waitForTimeout(1500);
const hero = p.locator(".hero-section").first();
const hb = await hero.boundingBox();
const clip = { x:hb.x, y:hb.y, width:hb.width, height:Math.min(hb.height,470) };
for (let i=0;i<10;i++){ await p.screenshot({path:`${OUT}/h-${i}.png`, clip}); await p.waitForTimeout(2800); }
await b.close(); console.log("done");
