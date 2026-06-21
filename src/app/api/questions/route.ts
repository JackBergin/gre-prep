import { NextRequest, NextResponse } from "next/server";
import {
  getQuestionById,
  getQuestionsBySection,
  questions,
} from "@/lib/questions";
import { getQuestionsForTest, getTestById } from "@/lib/tests";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const section = searchParams.get("section");
  const testId = searchParams.get("test");
  const id = searchParams.get("id");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  if (id) {
    const question = getQuestionById(id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(question);
  }

  let result = questions;

  if (testId) {
    const test = getTestById(testId);
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }
    result = getQuestionsForTest(testId);
  } else if (section) {
    result = getQuestionsBySection(section);
  }

  const start = offset ? parseInt(offset, 10) : 0;
  const end = limit ? start + parseInt(limit, 10) : undefined;

  if (offset || limit) {
    result = result.slice(start, end);
  }

  return NextResponse.json(result);
}
