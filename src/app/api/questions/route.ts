import { NextRequest, NextResponse } from "next/server";
import { getQuestionsBySection, questions } from "@/lib/questions";

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section");
  if (!section) {
    return NextResponse.json(questions);
  }
  const filtered = getQuestionsBySection(section);
  return NextResponse.json(filtered);
}
