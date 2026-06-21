import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/score/route";

describe("POST /api/score", () => {
  it("scores a verbal quiz submission", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "verbal",
          answers: [
            { questionId: "v1", selectedAnswer: null },
            { questionId: "v2", selectedAnswer: null },
          ],
        }),
      })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.section).toBe("verbal");
    expect(data.totalQuestions).toBe(2);
    expect(data.skippedCount).toBe(2);
    expect(data.scaledScore).toBeGreaterThanOrEqual(130);
    expect(data.scaledScore).toBeLessThanOrEqual(170);
  });

  it("returns 400 for invalid payload", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "verbal" }),
      })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Invalid payload" });
  });

  it("returns 400 when section is missing", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: [] }),
      })
    );

    expect(response.status).toBe(400);
  });

  it("scores quantitative answers with scaled score", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "quantitative",
          answers: [{ questionId: "q1", selectedAnswer: "wrong" }],
        }),
      })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.section).toBe("quantitative");
    expect(data.incorrectCount).toBe(1);
    expect(data.scaledScore).toBe(130);
  });
});
