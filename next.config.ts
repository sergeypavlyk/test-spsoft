import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  output: "export",
  productionBrowserSourceMaps: true,
  images: { unoptimized: true },
};

export default nextConfig;
