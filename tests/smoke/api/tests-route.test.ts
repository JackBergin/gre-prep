import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/tests/route";

describe("GET /api/tests", () => {
  it("returns all tests when no section filter is provided", async () => {
    const response = await GET(new NextRequest("http://localhost/api/tests"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      section: expect.stringMatching(/^(verbal|quantitative|writing)$/),
    });
  });

  it("returns only verbal tests when section=verbal", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/tests?section=verbal")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.every((test: { section: string }) => test.section === "verbal")).toBe(
      true
    );
    expect(data.some((test: { id: string }) => test.id === "verbal-practice-1")).toBe(
      true
    );
  });
});
