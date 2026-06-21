import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/questions/route";
import { getQuestionById, getQuestionsBySection } from "@/lib/questions";
import { getQuestionsForTest } from "@/lib/tests";

describe("GET /api/questions", () => {
  it("returns all questions when no filters are provided", async () => {
    const response = await GET(new NextRequest("http://localhost/api/questions"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(100);
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      section: expect.stringMatching(/^(verbal|quantitative|writing)$/),
      prompt: expect.any(String),
    });
  });

  it("filters questions by section", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/questions?section=verbal")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.every((q: { section: string }) => q.section === "verbal")).toBe(true);
    expect(data.length).toBe(getQuestionsBySection("verbal").length);
  });

  it("returns questions for a valid test id", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/questions?test=verbal-quick-drill")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.length).toBe(10);
    expect(data).toEqual(getQuestionsForTest("verbal-quick-drill"));
  });

  it("returns 404 when test id is unknown", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/questions?test=missing-test")
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: "Test not found" });
  });

  it("returns a single question by id", async () => {
    const question = getQuestionById("v1");
    expect(question).toBeDefined();

    const response = await GET(
      new NextRequest("http://localhost/api/questions?id=v1")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(question);
  });

  it("returns 404 when question id is unknown", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/questions?id=not-a-real-id")
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: "Question not found" });
  });

  it("paginates with limit and offset", async () => {
    const verbal = getQuestionsBySection("verbal");
    const response = await GET(
      new NextRequest("http://localhost/api/questions?section=verbal&limit=5&offset=3")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.length).toBe(5);
    expect(data).toEqual(verbal.slice(3, 8));
  });

  it("applies offset without limit through end of list", async () => {
    const verbal = getQuestionsBySection("verbal");
    const response = await GET(
      new NextRequest(`http://localhost/api/questions?section=verbal&offset=${verbal.length - 2}`)
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.length).toBe(2);
    expect(data).toEqual(verbal.slice(-2));
  });
});
