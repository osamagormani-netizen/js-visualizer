import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/js-visualizer",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
