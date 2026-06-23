import type { NextConfig } from "next";

// When deploying to GitHub Pages the site is served from a project subpath
// (https://<user>.github.io/<repo>/), so assets and routes must be prefixed.
// The workflow sets NEXT_PUBLIC_BASE_PATH="/gre-prep"; local builds leave it
// empty so the app is served from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["100.114.189.119"],
  // Emit a fully static site into `out/` that any static host can serve.
  output: "export",
  // GitHub Pages cannot run the Next.js Image Optimization server.
  images: { unoptimized: true },
  // Serve each route as `<route>/index.html` so GitHub Pages resolves deep
  // links without a server-side rewrite layer.
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
