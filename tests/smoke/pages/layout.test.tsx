import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "@/app/layout";

describe("Root layout smoke", () => {
  it("exports page metadata", () => {
    // title is a default/template object so child routes inherit "%s — PrismPrep".
    expect(metadata.title).toMatchObject({
      default: expect.stringContaining("PrismPrep"),
      template: expect.stringContaining("PrismPrep"),
    });
    expect(metadata.description).toMatch(/GRE prep/i);
  });

  it("exposes SEO and social metadata", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://prismprep.com/");
    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.openGraph?.title).toMatch(/PrismPrep/);
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("renders shared header and page children inside main", () => {
    render(
      <RootLayout>
        <p>Page content</p>
      </RootLayout>,
      { container: document.body }
    );

    expect(screen.getByRole("link", { name: "PrismPrep home" })).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
    expect(document.querySelector("main.min-h-screen")).toContainElement(
      screen.getByText("Page content")
    );
  });
});
