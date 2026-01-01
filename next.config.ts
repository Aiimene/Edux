import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compiler optimizations (SWC minification is enabled by default in Next.js 16)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },
  
  // Experimental features for faster builds
  experimental: {
    // Optimize package imports - reduces bundle size and build time
    optimizePackageImports: ['chart.js', 'react-chartjs-2', 'axios', 'framer-motion'],
  },
};

export default nextConfig;
