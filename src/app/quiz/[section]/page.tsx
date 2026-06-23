import { sections } from "@/lib/sections";
import QuizClient from "./QuizClient";

// Prerender one static page per section so `output: "export"` can emit
// /quiz/verbal, /quiz/quantitative, and /quiz/writing at build time.
export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export const dynamicParams = false;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return <QuizClient section={section} />;
}
