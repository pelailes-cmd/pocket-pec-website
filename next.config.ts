import path from "node:path";
import type { NextConfig } from "next";

// Static export: `npm run build` writes a self-contained site to `out/` that can be
// hosted on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3...).
// Set NEXT_PUBLIC_BASE_PATH when the site is served from a sub-path, e.g. "/pocket-pec".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // Keep Turbopack scoped to this folder (a lockfile higher up would widen it).
  turbopack: { root: path.resolve(__dirname) },
  agentRules: false,
};

export default nextConfig;
