// Reuse the Open Graph image for X/Twitter cards so the two never drift.
export { default, alt, size, contentType } from "./opengraph-image";

// Emit as a static file for `output: "export"`.
export const dynamic = "force-static";
