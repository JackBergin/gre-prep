/**
 * Central site configuration.
 *
 * Single source of truth for the public domain, brand strings, and SEO/GEO
 * copy. Change `url` here when the domain is registered and every canonical
 * URL, sitemap entry, robots directive, and structured-data @id updates with it.
 */
export const site = {
  name: "PrismPrep",
  // Update this single value once the domain is live (no trailing slash).
  url: "https://prismprep.com",
  tagline: "Free GRE Practice — Clarity from Complexity",
  description:
    "PrismPrep is a free GRE prep tool that refracts the exam into three focused paths — Verbal Reasoning, Quantitative Reasoning, and Analytical Writing — with 300 timed practice questions and instant scoring. No account, no paywall.",
  // Short, entity-rich blurb reused for social cards and AI engine summaries.
  shortDescription:
    "Free GRE practice with 300 timed questions across Verbal, Quantitative, and Analytical Writing, plus instant scoring.",
  locale: "en_US",
  author: "Jack Bergin",
  // Helpful for GEO: concrete, citable facts about the product.
  stats: {
    totalQuestions: 300,
    questionsPerSection: 100,
    sections: 3,
    practiceTests: 18,
    price: 0,
  },
  twitterHandle: "@prismprep",
  keywords: [
    "GRE prep",
    "free GRE practice",
    "GRE practice test",
    "GRE verbal reasoning",
    "GRE quantitative reasoning",
    "GRE analytical writing",
    "GRE practice questions",
    "online GRE prep",
    "GRE study tool",
    "GRE test prep free",
  ],
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = ""): string {
  return new URL(path, site.url).toString();
}

/**
 * Deployment base path (e.g. "/gre-prep" on GitHub Pages, "" locally).
 * Mirrors `basePath`/`assetPrefix` in next.config.ts.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a root-relative public asset path with the deployment base path so
 * it resolves correctly when the site is served from a subpath. Next.js does
 * not auto-prefix string asset URLs in metadata/manifest, so do it explicitly.
 */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
