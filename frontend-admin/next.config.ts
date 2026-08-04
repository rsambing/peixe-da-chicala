import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All images here come from remote CDNs (ImgBB, Unsplash) that already
    // serve pre-sized assets. Next's built-in optimizer re-fetches and
    // re-encodes them with a hardcoded 7s timeout — over this connection
    // that consistently aborts (500 on every /_next/image request), so we
    // skip it and serve the original URLs directly.
    unoptimized: true,
  },
};

export default nextConfig;
