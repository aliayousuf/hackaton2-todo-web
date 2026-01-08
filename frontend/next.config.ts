import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
};

// Export to ensure proper route pre-building
export default nextConfig;