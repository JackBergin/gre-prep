import { Section } from "./types";

export const sections: Section[] = ["verbal", "quantitative", "writing"];

export const sectionRayVar: Record<Section, string> = {
  verbal: "var(--prism-ray-verbal)",
  quantitative: "var(--prism-ray-quant)",
  writing: "var(--prism-ray-writing)",
};
