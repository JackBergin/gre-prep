import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

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
    background_color: "#E0E5EC",
    theme_color: "#5B7CFA",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
