import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/js-visualizer",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/js-visualizer",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
