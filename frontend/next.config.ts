import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Disable Next.js image optimization since Cloudinary already handles it
    // We use Cloudinary's f_auto and q_auto for optimization
    unoptimized: true,
  },
  // Enable compression for better performance
  compress: true,
};

export default nextConfig;
