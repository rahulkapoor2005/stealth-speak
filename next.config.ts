import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  eslint: {
    ignoreDuringBuilds: true, 
  },
  typescript: {
    ignoreBuildErrors: false, 
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }; 
    return config;
  },
};

export default nextConfig;
