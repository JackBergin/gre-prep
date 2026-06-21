import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

/**
 * robots.txt served at /robots.txt.
 *
 * - Search crawlers and AI/LLM crawlers are welcomed (GEO): being crawlable by
 *   GPTBot, ClaudeBot, PerplexityBot, etc. is what makes the site eligible to
 *   be summarized and cited in generative answers.
 * - Transient/personal routes (/quiz, /results) and the API are disallowed.
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/quiz/", "/results", "/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Explicitly opt the AI crawlers in (they honor a named allow rule).
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
