import { NextRequest, NextResponse } from "next/server";
import { Section } from "@/lib/types";
import { getTestsBySection, tests } from "@/lib/tests";

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section") as Section | null;
  if (section) {
    return NextResponse.json(getTestsBySection(section));
  }
  return NextResponse.json(tests);
}
