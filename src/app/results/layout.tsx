import type { Metadata } from "next";

// Results are personal to a single attempt — exclude from search indexing.
export const metadata: Metadata = {
  title: "Your Results",
  robots: { index: false, follow: true },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
