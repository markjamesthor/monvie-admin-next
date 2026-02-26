import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/monvie-admin-next",
  images: { unoptimized: true },
};

export default nextConfig;
