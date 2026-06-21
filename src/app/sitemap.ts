import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * XML sitemap served at /sitemap.xml. Lists the public, indexable documents.
 * Section views live under /practice#<section> fragments rather than distinct
 * URLs, so they are not separate sitemap entries. Transient pages (active quiz,
 * personal results) are excluded and also marked noindex in their metadata.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/practice"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
