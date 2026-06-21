import { NextRequest, NextResponse } from "next/server";
import { getQuestionsBySection } from "@/lib/questions";
import { calculateScore } from "@/lib/scoring";
import { ScoreRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body: ScoreRequest = await req.json();
  const { section, answers } = body;

  if (!section || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const sectionQuestions = getQuestionsBySection(section);
  const result = calculateScore(section, sectionQuestions, answers);

  return NextResponse.json(result);
}
