import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "covers.openlibrary.org",
      "books.google.com", // add any other domains you use for images
      // ...add more as needed
    ],
  },
};

export default nextConfig;
