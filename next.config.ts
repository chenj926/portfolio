import type { NextConfig } from "next";

// GitHub Pages serves the site under /portfolio; a local preview builds with an empty base.
const basePath = process.env.SITE_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default config;
