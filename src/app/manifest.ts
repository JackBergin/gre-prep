import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { site } from "@/lib/site";

// Emit as a static file for `output: "export"`.
export const dynamic = "force-static";

/**
 * Web app manifest served at /manifest.webmanifest. Makes PrismPrep
 * installable as a PWA and gives crawlers a clean app identity.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Free GRE Practice`,
    short_name: site.name,
    description: site.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: brand.bgLight,
    theme_color: brand.bgLight,
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icon-light.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-dark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon-light.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon-dark.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
