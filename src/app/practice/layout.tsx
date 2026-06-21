import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "GRE Practice Test Gallery",
  description: `Browse ${site.stats.practiceTests} free, timed GRE practice tests across Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. ${site.stats.totalQuestions} questions with instant scoring — no account needed.`,
  alternates: { canonical: "/practice" },
  openGraph: {
    title: `GRE Practice Test Gallery — ${site.name}`,
    description: `${site.stats.practiceTests} free, timed GRE practice tests with instant scoring.`,
    url: `${site.url}/practice`,
  },
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice", path: "/practice" },
        ])}
      />
      {children}
    </>
  );
}
