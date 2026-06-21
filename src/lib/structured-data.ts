/**
 * Schema.org structured data (JSON-LD) builders.
 *
 * Structured data is the highest-leverage win for both classic SEO (rich
 * results) and GEO (generative engines parse JSON-LD to understand and cite a
 * site). Every builder returns a plain object that is serialized into a
 * <script type="application/ld+json"> tag via the <JsonLd> component.
 */
import { absoluteUrl, site } from "./site";
import { faqs } from "./faq";

const ORG_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    logo: absoluteUrl("/icon.svg"),
    sameAs: [] as string[],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: site.url,
    description: site.shortDescription,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Describes the product itself as a free educational web app. The `offers`
 * block with price 0 is what lets engines state "PrismPrep is free".
 */
export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: site.name,
    url: site.url,
    description: site.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser)",
    inLanguage: "en",
    isAccessibleForFree: true,
    publisher: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: site.stats.price,
      priceCurrency: "USD",
    },
    featureList: [
      `${site.stats.totalQuestions} GRE practice questions`,
      "Timed Verbal Reasoning practice",
      "Timed Quantitative Reasoning practice",
      "Analytical Writing prompts with rubric guidance",
      "Instant scoring",
      "No account required",
    ],
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** BreadcrumbList for secondary pages. Items are [name, path] pairs. */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
