import { NextRequest, NextResponse } from "next/server";
import { getQuestionsByIds } from "@/lib/questions";
import { calculateScore } from "@/lib/scoring";
import { ScoreRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body: ScoreRequest = await req.json();
  const { section, answers } = body;

  if (!section || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const questionIds = answers.map((a) => a.questionId);
  const questions = getQuestionsByIds(questionIds);
  const result = calculateScore(section, questions, answers);

  return NextResponse.json(result);
}
