import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

      // Google thumbnails
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },

      // Facebook CDN
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },

      // Revv images
      {
        protocol: "https",
        hostname: "www.revv.co.in",
      },

      // Ravindra Joisa images
      {
        protocol: "https",
        hostname: "ravindrajoisa.com",
      },
    ],
  },
};

export default nextConfig;