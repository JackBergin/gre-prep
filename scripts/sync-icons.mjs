import { writeFileSync } from "node:fs";
import { iconMarkSvg, ICON_MARK_DARK, ICON_MARK_LIGHT } from "./icon-mark.mjs";

const root = new URL("../", import.meta.url);

writeFileSync(new URL("public/icon-light.svg", root), iconMarkSvg(ICON_MARK_LIGHT));
writeFileSync(new URL("public/icon-dark.svg", root), iconMarkSvg(ICON_MARK_DARK));
writeFileSync(new URL("public/icon.svg", root), iconMarkSvg(ICON_MARK_LIGHT, { adaptive: true }));

console.log("Synced public/icon-light.svg, public/icon-dark.svg, and public/icon.svg");
