import type { Metadata } from "next";

// The active quiz is a transient, per-attempt view — keep it out of the index.
export const metadata: Metadata = {
  title: "Practice Quiz",
  robots: { index: false, follow: true },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
