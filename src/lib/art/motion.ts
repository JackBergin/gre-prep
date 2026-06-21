import { getArtConfig } from "./config";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function getEffectiveDpr(): number {
  if (typeof window === "undefined") return 1;
  const { maxDpr } = getArtConfig(isMobileViewport());
  return Math.min(window.devicePixelRatio || 1, maxDpr);
}

export function subscribeVisibility(onChange: (visible: boolean) => void): () => void {
  if (typeof document === "undefined") return () => {};

  const handler = () => onChange(document.visibilityState === "visible");
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}

export function subscribeReducedMotion(onChange: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = () => onChange(mq.matches);
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

export function subscribeTheme(onChange: () => void): () => void {
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "data-theme") {
        onChange();
        break;
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
