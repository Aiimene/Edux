import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize build performance
  swcMinify: true, // Use SWC for minification (faster than Terser)
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },
  
  // Experimental features for faster builds
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['chart.js', 'react-chartjs-2', 'axios'],
  },
  
  // Reduce build output
  output: 'standalone', // Only if deploying to Docker/container
};

export default nextConfig;
